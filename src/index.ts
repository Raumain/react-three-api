import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const PORT = process.env.PORT || 3000;

// Create a new Elysia app with CORS middleware
const app = new Elysia()
	.use(
		cors({
			origin: process.env.ALLOWED_ORIGINS
				? process.env.ALLOWED_ORIGINS.split(",")
				: "*",
			methods: ["GET", "OPTIONS"],
			allowedHeaders: ["Content-Type"],
		}),
	)
	.get("/health", () => ({
		status: "ok",
		timestamp: new Date().toISOString(),
	}))
	.get("/model", async () => {
		try {
			const filePath = join(process.cwd(), "assets", "rafale.glb");
			const fileContent = await readFile(filePath);
			const fileStats = await stat(filePath);

			return new Response(fileContent, {
				headers: {
					"Content-Type": "model/gltf-binary",
					"Content-Disposition": 'inline; filename="model.glb"',
					"Content-Length": fileStats.size.toString(),
					"Cache-Control": "public, max-age=86400",
				},
			});
		} catch (error) {
			console.error("Error serving .glb file:", error);
			return new Response("File not found or error reading file", {
				status: 404,
			});
		}
	})
	.listen(PORT);

console.log(
	`🦊 Elysia server is running at ${app.server?.hostname}:${app.server?.port}`,
);
