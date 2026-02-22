import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { CommonResponse } from "../constants/constants";



/**
 * Class implements an interface describing implementation of an interceptor
 */
@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor {
  /**
   * Method to implement a custom interceptor. Transforms response
   *
   * @param {ExecutionContext} ctx - Details about the current request
   * @param {CallHandler} next - A reference to the `CallHandler`, which provides access to an
   * `Observable` representing the response stream from the route handler
   * @returns {Observable<CommonResponse>} - Response stream from the route handler
   */
  public intercept(ctx: ExecutionContext, next: CallHandler): Observable<CommonResponse<T> | T> {
    return next.handle().pipe(
      map((data: T) => {
        if (ctx.switchToHttp().getRequest<Request>().url.startsWith("/api/auth")) {return data;}

        return {
          statusCode: ctx.switchToHttp().getResponse<Response>().statusCode,
          data,
        };
      }),
    );
  }
}
