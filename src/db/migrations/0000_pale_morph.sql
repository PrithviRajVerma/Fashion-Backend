CREATE TYPE "public"."auth_provider" AS ENUM('EMAIL', 'GOOGLE', 'BOTH');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('USER', 'STAFF', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."orderStatus" AS ENUM('PLACED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELED', 'RETURNED');--> statement-breakpoint
CREATE TYPE "public"."paymentStatus" AS ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TABLE "address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userID" uuid NOT NULL,
	"latitude" numeric(9, 6) NOT NULL,
	"longitude" numeric(9, 6) NOT NULL,
	"accuracy" numeric(6, 2),
	"city" varchar(100),
	"state" varchar(100),
	"pincode" varchar(10),
	"country" varchar(50),
	"source" varchar(20) DEFAULT 'BROWSER',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cartItems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"productVariant" uuid NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_tokens" (
	"token" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(155) NOT NULL,
	"slug" varchar(155) NOT NULL,
	"description" text,
	"categoryId" uuid NOT NULL,
	"brand" varchar(100),
	"isActive" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_auth" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"google_sub" varchar(255) NOT NULL,
	"passwordHashed" varchar(150),
	"auth_provider" "auth_provider" DEFAULT 'GOOGLE' NOT NULL,
	"role" "role" DEFAULT 'USER' NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_auth_email_unique" UNIQUE("email"),
	CONSTRAINT "user_auth_google_sub_unique" UNIQUE("google_sub")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"totalAmount" numeric(10, 2) NOT NULL,
	"orderStatus" "orderStatus" DEFAULT 'PLACED' NOT NULL,
	"paymentStatus" "paymentStatus" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orderItems" (
	"id" uuid PRIMARY KEY NOT NULL,
	"orderId" uuid NOT NULL,
	"variantId" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"size" varchar(10) NOT NULL,
	"color" varchar(50) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"sku" varchar(50) NOT NULL,
	CONSTRAINT "product_variants_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" varchar(50) NOT NULL,
	"gender" varchar(10),
	"profile_picture_url" varchar(255),
	"dob" date,
	"updated_at" date
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY NOT NULL,
	"stock" integer NOT NULL,
	"lowStockThreshold" integer DEFAULT 5
);
--> statement-breakpoint
CREATE TABLE "refresh_token" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"userID" uuid NOT NULL,
	"token_hashed" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"isRevoked" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_userID_user_profile_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_userId_user_profile_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_productVariant_product_variants_id_fk" FOREIGN KEY ("productVariant") REFERENCES "public"."product_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_user_profile_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_variantId_product_variants_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_id_user_auth_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user_auth"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_id_product_variants_id_fk" FOREIGN KEY ("id") REFERENCES "public"."product_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_userID_user_auth_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user_auth"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_user_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;