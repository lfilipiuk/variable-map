import { describe, expect, it, beforeAll } from "vitest";
import { createEdges, createEntities } from "./variable-map.js";
import data from "../data/data.json";

let items;
let edges;

beforeAll(() => {
  items = createEntities(data);
  edges = createEdges(items);
});

describe("createEntities", function () {
  it("should return an array of objects", function () {
    expect(items).toBeInstanceOf(Array);
    expect(items[0]).toBeInstanceOf(Object);
  });
  it("should return an array of objects with id and __typename properties", function () {
    expect(items[0]).toHaveProperty("id");
    expect(items[0]).toHaveProperty("__typename");
  });
  it("should return a number of objects equal to the number of objects in the data", function () {
    const dataLength = items.length;
    expect(dataLength).toBe(33);
  });
  it("should return correct parentId for each object", function () {
    expect(items[0].parentId).toBe(null);
    expect(items[6].parentId).toBe("CampaignSetting-53");
    expect(items[8].parentId).toBe("CampaignSetting-53");
    expect(items[9].parentId).toBe("BaseAdtext-64");
    expect(items[10].parentId).toBe("BaseAdtext-65");
    expect(items[11].parentId).toBe("CampaignSetting-53");
    expect(items[32].parentId).toBe("AdditionalSource-18");
  });
  it("should return correct uniqueId for DataSourceValue entity", function () {
    expect(items[30].uniqueId).toBe(
      "DataSourceVariable-weather_today_temp_day",
    );
  });
});

describe("createEdges", function () {
  it("should return an array of objects", function () {
    expect(edges).toBeInstanceOf(Array);
  });

  it("should return correct number of edges", function () {
    expect(edges.length).toBe(64);
  });

  // it("should not create edges for non-existent nodes", function () {
  //   // there is an edge to Praha, and we don't have this node
  // });

  it("should generate edge between CampaignSetting and first of the BaseAdtext entities", function () {
    expect(
      edges.some((obj) => obj.id === "edge-CampaignSetting-53-BaseAdtext-64"),
    ).toBe(true);
  });

  it("should generate edge from AdditionalSource to DataSourceVariable", function () {
    expect(
      edges.some(
        (obj) =>
          obj.id ===
          "edge-AdditionalSource-18-DataSourceVariable-sheet_akce_brandu",
      ),
    ).toBe(true);
  });

  it("should generate edge from DataSourceVariable to AdditionalSource", function () {
    expect(
      edges.some(
        (obj) => obj.id === "edge-DataSourceVariable-brand-AdditionalSource-18",
      ),
    ).toBe(true);
  });

  it("should generate edge from DataSourceVariable with correct prefix", function () {
    expect(
      edges.some(
        (obj) =>
          obj.id ===
          "edge-DataSourceVariable-weather_today_temp_day-DataSourceVariable-templota",
      ),
    ).toBe(true);
  });
});
