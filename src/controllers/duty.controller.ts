// controller.js
import { pool } from "../config";
import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { convertSortQueryParams, SortParamsObject } from "../utils/utils";
import {
  NO_RECORD_ERROR,
  RECORD_ADDED,
  RECORD_UPDATED,
  RECORD_DELETED,
  RECORDS,
} from "../constants/messages";

import { Model as DutyModel } from "../models/duty.model";

interface RequestQuery {
  sort?: string;
  page?: string;
  limit?: string;
}

interface RequestQueryOptions {
  sort?: string;
  skip?: number;
  limit?: number | null;
}

export const getDuties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sort, page = 1, limit } = req.query as unknown as RequestQuery;
    let options: RequestQueryOptions = {
      skip: 0,
      limit: null,
      sort: "id",
    };

    if (!!sort) {
      options.sort = convertSortQueryParams(sort);
    }

    if (!!limit) {
      options.limit = parseInt(limit as string, 10);
    }

    if (!!page && !!limit) {
      options.skip =
        (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
    }

    // console.log(options);
    const data = await pool.query(
      `SELECT * FROM ${DutyModel.TABLE_NAME} ORDER BY ${options.sort} offset ${options.skip} limit ${options.limit};`
    );

    return res.status(200).json({
      status: 200,
      message: RECORDS,
      data: data.rows,
    });
  } catch (error) {
    return next(error);
  }
};

export const createDuty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;
  const query = `INSERT INTO ${DutyModel.TABLE_NAME} (name) VALUES($1) RETURNING *;`;
  const values = [name];
  try {
    const data = await pool.query(query, values);

    return res.status(201).json({
      status: 201,
      message: RECORD_ADDED,
      data: data.rows,
    });
  } catch (error) {
    return next(error);
  }
};

export const getDutyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const query = `SELECT * FROM ${DutyModel.TABLE_NAME}  WHERE id=$1;`;
  const value = [id];

  try {
    const data = await pool.query(query, value);

    if (data.rowCount == 0) return res.status(404).send(NO_RECORD_ERROR);

    return res.status(200).json({
      status: 200,
      message: RECORDS,
      data: data.rows,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateDuty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  const id = req.params.id;
  const { name } = req.body;

  const query = `UPDATE ${DutyModel.TABLE_NAME}  SET name=$1 WHERE ${DutyModel.PRIMARY_KEY}=$2 RETURNING *;`;
  const value = [name, id];

  try {
    const data = await pool.query(query, value);

    if (data.rowCount == 0) return res.status(404).send(NO_RECORD_ERROR);

    return res.status(200).json({
      status: 200,
      message: RECORD_UPDATED,
      data: data.rows,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteDuty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const value = [id];
  const query = `DELETE FROM ${DutyModel.TABLE_NAME}  WHERE id=$1;`;

  try {
    const data = await pool.query(query, value);

    if (data.rowCount == 0) return res.status(404).send(NO_RECORD_ERROR);

    return res.status(200).json({
      status: 200,
      message: RECORD_DELETED,
    });
  } catch (error) {
    return next(error);
  }
};
