import { describe, expect, it, beforeAll } from "vitest";
import { createEdges, createEntities } from "./variable-map.js";
import data from "../data/data.json";

let newData;
let edges;

beforeAll(() => {
  newData = createEntities(data);
  edges = createEdges(newData);
});

describe("createEntities", function () {
  it("should return an array of objects", function () {
    expect(newData).toBeInstanceOf(Array);
    expect(newData[0]).toBeInstanceOf(Object);
  });
  it("should return an array of objects with id and __typename properties", function () {
    expect(newData[0]).toHaveProperty("id");
    expect(newData[0]).toHaveProperty("__typename");
  });
  it("should return a number of objects equal to the number of objects in the data", function () {
    const dataLength = newData.length;
    expect(dataLength).toBe(36);
  });
  it("should return correct parentId for each object", function () {
    expect(newData[0].parentId).toBe(null);
    expect(newData[6].parentId).toBe("CampaignSetting-53");
    expect(newData[8].parentId).toBe("CampaignSetting-53");
    expect(newData[9].parentId).toBe("BaseAdtext-64");
    expect(newData[10].parentId).toBe("BaseAdtext-65");
    expect(newData[33].parentId).toBe("DataSourceVariable-sheet_akce_brandu");
  });
  it("should return correct uniqueId for DataSourceValue entity", function () {
    expect(newData[30].uniqueId).toBe(
      "DataSourceVariable-weather_today_temp_day",
    );
  });
});

describe("createEdges", function () {
  it("should return an array of objects", function () {

    console.log(newData)
    edges.forEach((edge) => {
      console.log(edge.id);
    });

    //expect(edges.length).toBe(3);
  });
});
