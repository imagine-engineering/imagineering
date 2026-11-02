"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products } from "@/lib/product-content"
import { productRoadmaps, type RoadmapItem } from "@/lib/product-roadmaps"

function RoadmapCards({
  items,
  status,
  empty,
}: {
  items: RoadmapItem[]
  status: string
  empty: string
}) {
  return (
    <div className="flex flex-col gap-4">
      {items.length ? (
        items.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-border bg-card p-6"
          >
            <p className="text-xs font-medium text-primary mb-3">{status}</p>
            <h4 className="text-lg font-medium text-foreground mb-2">
              {item.title}
            </h4>
            <p className="text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))
      ) : (
        <p className="rounded-xl border border-border p-6 text-sm leading-6 text-muted-foreground">
          {empty}
        </p>
      )}
    </div>
  )
}

export function ProductRoadmap() {
  return (
    <section
      className="w-full px-5 py-8 md:py-14"
      aria-labelledby="roadmap-heading"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center flex flex-col items-center gap-4 py-8 md:py-14">
          <h2
            id="roadmap-heading"
            className="text-4xl md:text-5xl font-semibold leading-tight text-foreground"
          >
            Product roadmaps
          </h2>
          <p className="max-w-[600px] text-muted-foreground text-base leading-relaxed">
            Explore current features, what we’re working on and what’s planned.
            Plans can change; no delivery dates are promised.
          </p>
        </div>
        <Tabs defaultValue="copper">
          <div className="flex justify-center">
            <TabsList
              aria-label="Product roadmaps"
              className="h-auto flex-wrap rounded-lg border border-border p-0.5 gap-1"
            >
              {products.map((product) => (
                <TabsTrigger
                  key={product.id}
                  value={product.id}
                  className="rounded-md px-3 py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  {product.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {products.map((product) => (
            <TabsContent
              key={product.id}
              value={product.id}
              className="mt-6 rounded-xl"
            >
              <div className="mb-6">
                <h3 className="text-xl font-medium text-foreground">
                  {product.name}{" "}
                  <span className="text-sm text-primary">{product.status}</span>
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {productRoadmaps[product.id].note}
                </p>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Current features
                </h3>
                <RoadmapCards
                  items={productRoadmaps[product.id].available}
                  status="Development build"
                  empty="This product is still in development. Features being worked on are listed below."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-4">
                    In progress
                  </h3>
                  <RoadmapCards
                    items={productRoadmaps[product.id].underway}
                    status="In development"
                    empty="No further features are announced as in progress."
                  />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-4">
                    Planned
                  </h3>
                  <RoadmapCards
                    items={productRoadmaps[product.id].planned}
                    status="Planned"
                    empty="No further feature plans have been announced."
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
