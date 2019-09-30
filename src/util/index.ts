import { Response, Request, NextFunction } from "express";

export { StatusCode } from "./status";

export { Api } from "./Api";

export const responseClient = (res: Response, httpCode: number, code: number, message: string, data = {}) => {
	const responseData = {
		code,
		message,
		timestamp: new Date().getTime(),
		data
	};
	res.status(httpCode).json(responseData);
};

export const send2Client = (res: Response, httpCode: number, status: { code: number; message: string }, data = {}) => {
	const responseData = {
		code: status.code,
		message: status.message,
		timestamp: new Date().getTime(),
		data
	};
	res.status(httpCode).json(responseData);
};
