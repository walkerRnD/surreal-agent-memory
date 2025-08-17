MCP with npx
```json
{
	"mcpServers": {
		"surreal-agent-memory": {
			"command": "npx",
			"args": ["-y", "surreal-agent-memory"],
			"env": {
        "DB_HOST": "surrealkv://data.db",
        "DB_NAMESPACE": "local",
        "DB_DATABASE": "persisted",
        "DB_USERNAME": "root",
        "DB_PASSWORD": "root",
				"LOCAL_DIR_PATH": "surrealkv://$HOME/OneDrive/Documents/dev/+shared/agent-memory"
			},
			"alwaysAllow": [
				"create_entities",
				"create_relations",
				"delete_entities",
				"add_observations",
				"delete_observations",
				"delete_relations",
				"read_graph",
				"search_nodes",
				"open_nodes"
			]
	  }
  }
}
```

with CLI and http
```terminal
npx surreal-agent-memory --mode server --port 3000 --host surreal://data.db --namespace local --database persisted --username root --password root --local-dir-path surreal://$HOME/OneDrive/Documents/dev/+shared/agent-memory
```
or
```terminal
npx surreal-agent-memory --config ./config.json
```



```json
{
	"mcpServers": {
		"surreal-agent-memory": {
			"type": "streamable-http",
			"url": "http://localhost:3000",
			"alwaysAllow": [
				"create_entities",
				"create_relations",
				"delete_entities",
				"add_observations",
				"delete_observations",
				"delete_relations",
				"read_graph",
				"search_nodes",
				"open_nodes"
			]
	  }
  }
}
```

WEB UI
- Cytoscape

build modes in package.json
- build # official website (vercel adapter)
- build:local # official website (node adapter)
- build:server # build MPC server with UI
- build:cli # build CLI
- build:electron


MCP modes
- [x] Direct Memory Management <--Currently Here
- [ ] Memory Manager Agent MCP
- [ ] Workspace Librarian Agent 
- [ ] Aggregator


Retrieval Architecture
- [x] Raw Read and Write  <--Currently Here
- [ ] simple RAG
- [ ] graph RAG
- [ ] hyper graph RAG
- [ ] lazy graph Rag


Agent Memory Architecture
- [ ] Reflection
Studying...


Feature
Codebase indexing


Objective
- easy to use (local, cloud, edge)
- flexible
- bench/spec oriented
- test latest memory/rag architecture from papers
- multi platform
- UI integrated


DBs
- [x] Surreal DB  <--Currently Here
- [ ] Milvus DB
- [ ] Qdrant