function generateUniqueId(id, typename) {
  return id && typename ? `${typename}-${id}` : null;
}

export function createEntities(data, parent = null) {
  let results = [];

  if (typeof data === "object" && data !== null) {
    if ("id" in data && "__typename" in data) {
      const idKey =
        data.__typename === "DataSourceVariable" ? "placeholderName" : "id";
      const uniqueId = generateUniqueId(data[idKey], data.__typename);

      let parentId = null;
      if ("parentId" in data && data.parentId !== 0) {
        parentId = generateUniqueId(data.parentId, data.__typename);
      } else if (parent) {
        const parentKey =
          parent.__typename === "DataSourceVariable" ? "placeholderName" : "id";

        parentId = generateUniqueId(parent[parentKey], parent.__typename);
      }

      // Special handling for 'DataSourceVariables' with additionalSource
      if (data.additionalSource && data.additionalSource.id) {
        parentId = generateUniqueId(
          data.additionalSource.id,
          data.additionalSource.__typename,
        );
      }

      const resultObject = {
        ...data,
        uniqueId,
        parentId,
      };
      results.push(resultObject);
    }

    Object.entries(data).forEach(([, value]) => {
      const nextParent = "id" in data ? data : parent;
      if ("additionalSource" in data) {
      } else {
        const childResults = createEntities(value, nextParent);
        results = results.concat(childResults);
      }
    });
  }

  return results;
}

export function createNodes(items) {
  return items.map((item) => ({
    id: item.uniqueId,
    position: { x: 0, y: 0 },
    data: item,
  }));
}

export function createEdges(items) {
  const edges = [];

  items.forEach((item) => {
    // Standard parent-child edges
    if (item.parentId) {
      edges.push({
        id: `edge-${item.parentId}-${item.uniqueId}`,
        source: item.parentId,
        target: item.uniqueId,
      });
    }

    // Special handling for 'AdditionalSource' nodes
    if (item.__typename === "AdditionalSource" && item.mappingField) {
      const uniqueId = generateUniqueId(
        item.mappingField,
        "DataSourceVariable",
      );
      edges.push({
        id: `edge-${uniqueId}-${item.uniqueId}`,
        source: uniqueId,
        target: item.uniqueId,
      });
    }

    // Handling placeholders and imageGen placeholders
    const placeholders = [
      ...(item.getPlaceholdersWithoutConditions || []),
      ...(item.getConditionsPlaceholders || []),
      ...(item.imageGen ? item.imageGen.getPlaceholdersWithoutConditions : []),
      ...(item.imageGen ? item.imageGen.getConditionsPlaceholders : []),
    ];

    const uniquePlaceholders = [...new Set(placeholders)];

    uniquePlaceholders.forEach((placeholder) => {
      const uniqueId = generateUniqueId(placeholder, "DataSourceVariable");

      edges.push({
        id: `edge-${uniqueId}-${item.uniqueId}`,
        source: uniqueId,
        target: item.uniqueId,
      });
    });
  });

  return edges;
}
