import data from "../data/data.json";
import 'reactflow/dist/style.css';
import { createEdges, createEntities, createNodes } from "./variable-map.js";
import {Background, Controls, ReactFlow, useEdgesState, useNodesState} from "reactflow";

const items = createEntities(data);
const initialEdges = createEdges(items);
const initialNodes = createNodes(items);


function App() {
  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <>
      <div className={"h-dvh"}>
        <ReactFlow defaultNodes={nodes} defaultEdges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
}

export default App;
