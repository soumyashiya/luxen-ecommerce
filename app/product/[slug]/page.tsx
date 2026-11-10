import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SERVICES, getProduct } from "@/lib/data";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import ProductPageClient from "./ProductPageClient";

type PageProps = { params: Promise<{ slug: string }> };

/* Pre-render every catalog product at build time (they're a static list). */
export function generateStaticParams() {
  return SERVICES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: true },
    };
  }

  const path = `/product/${product.slug}`;
  const title = `${product.title} — Research Reference Peptide`;
  const description = product.desc;
  const image = absoluteUrl(product.img);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [{ url: image, alt: `${product.title} — research reference peptide` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.long,
    image: [absoluteUrl(product.img), ...(product.gallery ?? []).map((g) => absoluteUrl(g))],
    sku: product.slug,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Laboratory research supplies",
    additionalProperty: product.specs.map((s) => ({
      "@type": "PropertyValue",
      name: s.label,
      value: s.value,
    })),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/product/${product.slug}`),
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Catalog", item: absoluteUrl("/shop") },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: absoluteUrl(`/product/${product.slug}`),
      },
    ],
  };

  return (
    <>
      <ProductPageClient product={product} />
      <Script
        id={`ld-product-${product.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Script
        id={`ld-breadcrumb-${product.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
