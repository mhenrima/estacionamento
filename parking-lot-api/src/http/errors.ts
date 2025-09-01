export class ClientError extends Error { }
export class UnauthorizedError extends ClientError { }
export class BadRequestError extends ClientError { }
export class NotFoundError extends ClientError { }
export class ForbiddenError extends ClientError { }