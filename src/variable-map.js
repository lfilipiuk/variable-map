function generateUniqueId(id, typename) {
  if (!id || !typename) {
    return null;
  }
  return `${typename}-${id}`;
}

export function createEntities(data, parent = null) {
  let results = [];

  if (typeof data === "object" && data !== null) {
    if ("id" in data && "__typename" in data) {
      let uniqueId;
      if (data.__typename === "DataSourceVariable") {
        uniqueId = generateUniqueId(data.placeholderName, data.__typename);
      } else {
        uniqueId = generateUniqueId(data.id, data.__typename);
      }

      const alreadyHasParent = "parentId" in data && data.parentId !== "0";
      let parentId = null;
      if (alreadyHasParent) {
        parentId = generateUniqueId(data.parentId, data.__typename);
      } else {
        if (parent.__typename === "DataSourceVariable") {
          parentId = generateUniqueId(
            parent.placeholderName,
            parent.__typename,
          );
        } else {
          parentId = generateUniqueId(parent.id, parent.__typename);
        }
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
      const childResults = createEntities(value, nextParent);
      results = results.concat(childResults);
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
    if (item.__typename === "AdditionalSource" && item.mapping) {
      edges.push({
        id: `edge-${item.mapping}-${item.uniqueId}`,
        source: item.mapping,
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

    placeholders.forEach((placeholder) => {
      edges.push({
        id: `edge-${placeholder}-${item.uniqueId}`,
        source: placeholder,
        target: item.uniqueId,
      });
    });
  });

  return edges;
}
