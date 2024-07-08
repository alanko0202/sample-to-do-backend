import request from "supertest";
import app from "../index";
import { Pool } from "pg";
import { Model as DutyModel } from "../models/duty.model";
import {
  NO_RECORD_ERROR,
  RECORD_ADDED,
  RECORD_UPDATED,
  RECORD_DELETED,
  RECORDS,
} from "../constants/messages";

// Mock the PostgreSQL pool
jest.mock("pg", () => {
  const mPool = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

const pool = new Pool();

describe("Duties API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /duties", () => {
    it("should create a new duty", async () => {
      const duty = { name: "Test Duty" };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: duty });

      const response = await request(app).post("/duties").send(duty);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(duty);
      expect(pool.query).toHaveBeenCalledWith(
        `INSERT INTO ${DutyModel.TABLE_NAME} (name) VALUES($1) RETURNING *;`,
        [duty.name]
      );
    });

    it("should handle errors", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await request(app)
        .post("/duties")
        .send({ name: "Test Duty" });

      expect(response.status).toBe(500);
    });
  });

  describe("GET /duties", () => {
    it("should fetch all duties", async () => {
      const duties = [
        { id: "3a2f92df-b0e5-421e-a17b-576403534140", name: "Test Duty" },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: duties });

      const response = await request(app).get("/duties");

      let options = {
        skip: 0,
        limit: null,
        sort: "id",
      };

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(duties);
      expect(pool.query).toHaveBeenCalledWith(
        `SELECT * FROM ${DutyModel.TABLE_NAME} ORDER BY ${options.sort} offset ${options.skip} limit ${options.limit};`
      );
    });

    it("should handle errors", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await request(app)
        .get("/duties/")
        .send({ name: "Get Duties" });

      expect(response.status).toBe(500);
    });
  });


  describe("GET /duties/:id", () => {
    const duty = {
      id: "3a2f92df-b0e5-421e-a17b-576403534140",
      name: "Test Duty",
    };
    it("should fetch a duty", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: duty });

      const response = await request(app).get("/duties/" + duty.id);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(duty);
      expect(pool.query).toHaveBeenCalledWith(
        `SELECT * FROM ${DutyModel.TABLE_NAME}  WHERE id=$1;`,
        [duty.id]
      );
    });

    it("should handle errors", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await request(app)
        .get("/duties/" + duty.id)
        .send({ name: "Get Duty" });

      expect(response.status).toBe(500);
    });
  });

  describe("PUT /duties/:id", () => {
    const duty = {
      id: "3a2f92df-b0e5-421e-a17b-576403534140",
      name: "Updated Duty",
    };
    it("should update a duty", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: duty.name });

      const response = await request(app)
        .put("/duties/" + duty.id)
        .send({ name: duty.name });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(duty.name);
      expect(pool.query).toHaveBeenCalledWith(
        `UPDATE ${DutyModel.TABLE_NAME}  SET name=$1 WHERE ${DutyModel.PRIMARY_KEY}=$2 RETURNING *;`,
        [duty.name, duty.id]
      );
    });

    it("should handle errors", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await request(app)
        .put("/duties/" + duty.id)
        .send({ name: "Updated Duty" });

      expect(response.status).toBe(500);
    });
  });

  describe("DELETE /duties/:id", () => {
    const duty = {
      id: "3a2f92df-b0e5-421e-a17b-576403534140",
      name: "Updated Duty",
    };
    it("should delete a duty", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: duty.id });

      const response = await request(app)
        .delete("/duties/" + duty.id)
        .send({ id: duty.id });

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM ${DutyModel.TABLE_NAME}  WHERE ${DutyModel.PRIMARY_KEY}=$1;`,
        [duty.id]
      );
    });

    it("should handle errors", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await request(app).delete("/duties/" + duty.id);

      expect(response.status).toBe(500);
    });
  });
});
