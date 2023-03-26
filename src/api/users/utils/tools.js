import jwt from "jsonwebtoken";
import axios from "axios";

//WIP: Change JWT_SECRET
export const createAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
  );
export const verifyAccessToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, originalPayload) => {
      if (err) reject(err);
      else resolve(originalPayload);
    })
  );

export const instance = axios.create({
  baseURL: "http://localhost:3001",
});
