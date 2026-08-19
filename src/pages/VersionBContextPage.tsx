import type { ReactNode } from "react"
import { Button, Heading, Stack, Text } from "@/components/braid"
import { DEFAULT_SEARCH } from "@/src/hooks/searchQuery"
import { enterPrototype } from "@/src/hooks/useAppNavigation"
import type { ConceptPageProps } from "@/src/concepts/types"

const HYPOTHESIS =
  "Grouping personalised and fixed filters at the same level helps candidates find the right filters more easily. Sequencing personalised filters before fixed filters helps candidates find relevant jobs faster. Allowing multiple selections on personalised filters helps candidates refine results more precisely. Simplifying the appearance of fixed filters while scrolling stay focused on results. Showing a preview of job counts when selecting a filter helps candidates refine results with more confidence."

function ContextBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 items-center rounded-lg bg-white/10 px-4 text-base font-medium text-white">
      {children}
    </span>
  )
}

/** Version B delivery context cover — Figma 4427:33859 */
export function VersionBContextPage(_props: ConceptPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#051A49] px-4 py-10">
      <article className="w-full max-w-[600px] rounded-none bg-[#051A49] px-[50px] py-[50px] text-white">
        <Stack space="xlarge">
          <Stack space="medium">
            <Text className="text-lg font-medium leading-[27px] text-white">Q1 FY27</Text>
            <Heading level="1" className="text-[32px] font-bold leading-[43px] text-white">
              Search Result Filters
            </Heading>
            <Text className="text-lg leading-[27px] text-white">
              Improve the search results page filter system to help candidates find and use filters
              more easily when refining their results.
            </Text>
          </Stack>

          <Stack space="medium">
            <Text className="text-lg font-medium leading-[27px] text-white">Hypothesis</Text>
            <Text className="text-lg leading-[27px] text-white">{HYPOTHESIS}</Text>
          </Stack>

          <Stack space="medium">
            <Text className="text-lg font-medium leading-[27px] text-white">Surface</Text>
            <div className="flex flex-wrap gap-2">
              <ContextBadge>SERP</ContextBadge>
            </div>
          </Stack>

          <Stack space="medium">
            <Text className="text-lg font-medium leading-[27px] text-white">Platform</Text>
            <div className="flex flex-wrap gap-2">
              <ContextBadge>Desktop</ContextBadge>
              <ContextBadge>App</ContextBadge>
              <ContextBadge>Mobile web</ContextBadge>
            </div>
          </Stack>

          <div>
            <Button
              type="button"
              variant="solid"
              tone="formAccent"
              onClick={() =>
                enterPrototype("version-b", DEFAULT_SEARCH, {
                  platform: "desktop",
                  vbState: "filters",
                  view: "home",
                })
              }
            >
              Open Version B prototype
            </Button>
          </div>
        </Stack>
      </article>
    </div>
  )
}
