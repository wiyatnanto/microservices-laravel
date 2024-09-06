const { ApolloServer } = require("apollo-server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");

const supergraphSdl = new IntrospectAndCompose({
	subgraphs: [
		{ name: "posts", url: "http://localhost:8001/graphql" },
		{ name: "users", url: "http://localhost:8002/graphql" },
	],
});

const gateway = new ApolloGateway({
	supergraphSdl,
	__exposeQueryPlanExperimental: false,
});

(async () => {
	const server = new ApolloServer({
		gateway,
	});

	server.listen().then(({ url }: any) => {
		console.log(`🚀 Server ready at ${url}`);
	});
})();
