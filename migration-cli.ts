#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { join } from 'path';

// Define available apps and migration actions
// TODO: get them with redirSync methode
const AVAILABLE_APPS = ['app', 'admin'] as const;
type AppType = (typeof AVAILABLE_APPS)[number];

const MIGRATION_ACTIONS = [
  { name: 'Run migrations', value: 'run' },
  { name: 'Revert last migration', value: 'revert' },
  { name: 'Show migrations', value: 'show' },
  { name: 'Generate migration', value: 'generate' },
  { name: 'Create empty migration', value: 'create' },
] as const;

type MigrationAction = 'run' | 'revert' | 'show' | 'generate' | 'create';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message: string, color?: keyof typeof colors) {
  const colorCode = color ? colors[color] : '';
  console.log(`${colorCode}${message}${colors.reset}`);
}

function getOrmConfigPath(app: AppType): string {
  return join(__dirname, `apps/${app}/src/config/ormconfig.ts`);
}

function getMigrationsDir(app: AppType): string {
  return `apps/${app}/src/database/migrations`;
}

function executeMigrationCommand(
  app: AppType,
  action: MigrationAction,
  migrationName?: string,
) {
  const ormConfigPath = getOrmConfigPath(app);

  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`Running migration: ${action} for ${app}`, 'bright');
  log(`${'='.repeat(60)}\n`, 'cyan');

  let command = '';

  switch (action) {
    case 'run':
      command = `npm run typeorm -- migration:run -d ${ormConfigPath}`;
      break;
    case 'revert':
      command = `npm run typeorm -- migration:revert -d ${ormConfigPath}`;
      break;
    case 'show':
      command = `npm run typeorm -- migration:show -d ${ormConfigPath}`;
      break;
    case 'generate': {
      if (!migrationName) {
        log('Migration name is required for generate action', 'red');
        process.exit(1);
      }
      const generatePath = join(getMigrationsDir(app), migrationName);
      command = `npm run typeorm -- migration:generate ${generatePath} -d ${ormConfigPath}`;
      break;
    }
    case 'create': {
      if (!migrationName) {
        log('Migration name is required for create action', 'red');
        process.exit(1);
      }
      const createPath = join(getMigrationsDir(app), migrationName);
      command = `npm run typeorm -- migration:create ${createPath}`;
      break;
    }
  }

  log(`Executing: ${command}\n`, 'blue');

  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    log(`\n✓ Migration ${action} completed successfully!`, 'green');
  } catch {
    log(`\n✗ Migration ${action} failed!`, 'red');
    process.exit(1);
  }
}

async function interactiveMode() {
  log('\n🔧 Migration CLI Tool', 'bright');
  log('═══════════════════════════════════════\n', 'cyan');

  const { app } = await inquirer.prompt<{ app: AppType }>([
    {
      type: 'list',
      name: 'app',
      message: 'Which application do you want to run migrations for?',
      choices: AVAILABLE_APPS.map((a) => ({
        name: a.charAt(0).toUpperCase() + a.slice(1),
        value: a,
      })),
    },
  ]);

  const { action } = await inquirer.prompt<{ action: MigrationAction }>([
    {
      type: 'list',
      name: 'action',
      message: 'What migration action do you want to perform?',
      choices: MIGRATION_ACTIONS,
    },
  ]);

  let migrationName: string | undefined;

  if (action === 'generate' || action === 'create') {
    const { name } = await inquirer.prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the migration name:',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Migration name is required';
          }
          if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(input)) {
            return 'Migration name must start with a letter and contain only letters, numbers, and underscores';
          }
          return true;
        },
      },
    ]);
    migrationName = name;
  }

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to ${action} migration${
        migrationName ? ` "${migrationName}"` : ''
      } for ${app}?`,
      default: true,
    },
  ]);

  if (!confirm) {
    log('\n✗ Operation cancelled by user', 'yellow');
    process.exit(0);
  }

  executeMigrationCommand(app, action, migrationName);
}

interface CommandOptions {
  app?: string;
  name?: string;
}

function commandMode() {
  if (!process.argv.slice(2).length) {
    void interactiveMode();
    return;
  }

  const program = new Command();

  program
    .name('migration-cli')
    .description(
      'TypeORM migration management tool for app and admin applications',
    )
    .version('1.0.0');

  const addCommonOptions = (cmd: Command) => {
    return cmd
      .option(
        '-a, --app <app>',
        'Application to run migrations for (app or admin)',
      )
      .option(
        '-n, --name <name>',
        'Migration name (for generate/create actions)',
      );
  };

  addCommonOptions(program.command('run'))
    .description('Run pending migrations')
    .action((options: CommandOptions) => {
      const app = validateApp(options.app);
      executeMigrationCommand(app, 'run');
    });

  addCommonOptions(program.command('revert'))
    .description('Revert the last executed migration')
    .action((options: CommandOptions) => {
      const app = validateApp(options.app);
      executeMigrationCommand(app, 'revert');
    });

  addCommonOptions(program.command('show'))
    .description('Show all migrations and their status')
    .action((options: CommandOptions) => {
      const app = validateApp(options.app);
      executeMigrationCommand(app, 'show');
    });

  addCommonOptions(program.command('generate'))
    .description('Generate a new migration from entity changes')
    .action((options: CommandOptions) => {
      const app = validateApp(options.app);
      if (!options.name) {
        log('Error: Migration name is required for generate action', 'red');
        log('Use: migration-cli generate --app <app> --name <name>', 'yellow');
        process.exit(1);
      }
      executeMigrationCommand(app, 'generate', options.name);
    });

  addCommonOptions(program.command('create'))
    .description('Create a new empty migration file')
    .action((options: CommandOptions) => {
      const app = validateApp(options.app);
      if (!options.name) {
        log('Error: Migration name is required for create action', 'red');
        log('Use: migration-cli create --app <app> --name <name>', 'yellow');
        process.exit(1);
      }
      executeMigrationCommand(app, 'create', options.name);
    });

  program.parse(process.argv);
}

function validateApp(app: string | undefined): AppType {
  if (!app) {
    log('Error: --app option is required', 'red');
    log('Available apps: app, admin', 'yellow');
    process.exit(1);
  }

  if (!AVAILABLE_APPS.includes(app as AppType)) {
    log(`Error: Invalid app "${app}"`, 'red');
    log(`Available apps: ${AVAILABLE_APPS.join(', ')}`, 'yellow');
    process.exit(1);
  }

  return app as AppType;
}

// Start the CLI
commandMode();
