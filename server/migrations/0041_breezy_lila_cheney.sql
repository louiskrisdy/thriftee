CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"title" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"price" real NOT NULL
);
