const express = require("express");
const app = express();
const ST = require("stjs");
const axios = require("axios");

app.get("/", async (req: any, res: any) => {
	const posts = await axios
		.post("http://localhost:8001/graphql", {
			query: `
                query { 
                    posts {
                        paginatorInfo {
                            count
                            currentPage
                            firstItem
                            hasMorePages
                            lastItem
                            lastPage
                            perPage
                            total
                        }
                        data {
                            id
                            title
                            slug
                            content
                            image
                            is_published
                            created_at
                            updated_at
                            user_id
                        }
                    }
                }
            `,
		})
		.then((response: any) => {
			return response.data;
		});

	const users = await axios
		.post("http://localhost:8002/graphql", {
			query: `
                query { 
                     users {
                        data {
                        id
                        name
                        email_verified_at
                        created_at
                        updated_at
                        }
                    }
                }
            `,
		})
		.then((response: any) => {
			return response.data;
		});

	console.log(JSON.stringify(posts));
	console.log(JSON.stringify(users));

	const result = ST.select({
		items: [
			["a,", "b", "c", "d", "e"],
			[1, 2, 3, 4, 5],
		],
		posts,
		users,
	})
		.transformWith({
			rows: {
				"{{#each items}}": {
					row_number: "{{$index}}",
					columns: {
						"{{#each this}}": {
							content: "{{this}}",
							column_number: "{{$index}}",
						},
					},
				},
			},
			posts: "{{posts}}",
			users: "{{users}}",
		})
		.root();
	res.json(result);
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
