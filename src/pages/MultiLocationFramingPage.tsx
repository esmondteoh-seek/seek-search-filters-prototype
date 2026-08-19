import {
  Alert,
  Badge,
  Card,
  Column,
  Columns,
  Divider,
  Heading,
  List,
  ListItem,
  PageBlock,
  Secondary,
  Stack,
  Strong,
  Text,
  TextLink,
} from "@/components/braid"
import type { ReactNode } from "react"
import type { ConceptPageProps } from "@/src/concepts/types"

type Freshness = "Current" | "Aging" | "Stale"

type SourceEntry = {
  title: string
  href?: string
  type: string
  updated: string
  freshness: Freshness
  authority: string
  supports: string
}

const SOURCES: SourceEntry[] = [
  {
    title: "FY27 Q2 OKRs – Search",
    href: "https://myseek.atlassian.net/wiki/spaces/AJDT/pages/5746360792",
    type: "Confluence",
    updated: "18 Aug 2026",
    freshness: "Current",
    authority: "Official",
    supports: "OKR objective, discovery scope, KRs",
  },
  {
    title: "Jan–Mar 2026 candidate feedback",
    href: "https://myseek.atlassian.net/wiki/spaces/AJDT/pages/5356781616",
    type: "Confluence",
    updated: "4 May 2026",
    freshness: "Aging",
    authority: "Semi-official",
    supports: "HK GTM voice, customer need",
  },
  {
    title: "#gtm-candidateupdates thread",
    href: "https://seek.enterprise.slack.com/archives/CBVUMSF7Z/p1773649929047539",
    type: "Slack",
    updated: "Jan–Mar 2026",
    freshness: "Aging",
    authority: "Informal",
    supports: "HK multi-location ask",
  },
  {
    title: "AGNT-140",
    href: "https://myseek.atlassian.net/browse/AGNT-140",
    type: "Jira",
    updated: "Aug 2026",
    freshness: "Current",
    authority: "Official",
    supports: "Career Agent blank SRP on multi-place URL",
  },
  {
    title: "DCS-8442",
    href: "https://myseek.atlassian.net/browse/DCS-8442",
    type: "Jira",
    updated: "Nov 2023",
    freshness: "Stale",
    authority: "Official (historical)",
    supports: "Legacy multi-location context",
  },
  {
    title: "Search and Post supporting data",
    href: "https://myseek.atlassian.net/wiki/spaces/AJDT/pages/2025138538",
    type: "Confluence",
    updated: "Mar 2022",
    freshness: "Stale",
    authority: "Semi-official — do not size KRs",
    supports: "2022 saved-search % ceilings only",
  },
  {
    title: "DSP-64",
    href: "https://myseek.atlassian.net/browse/DSP-64",
    type: "Jira",
    updated: "Sep 2025",
    freshness: "Aging",
    authority: "Informal / parked",
    supports: "Historical multi-location ticket",
  },
  {
    title: "Multi-location jobs migration",
    href: "https://myseek.atlassian.net/wiki/spaces/AMU/pages/2162791635",
    type: "Confluence",
    updated: "2023",
    freshness: "Stale",
    authority: "Semi-official — hirer ads, not this problem",
    supports: "Out of scope boundary",
  },
  {
    title: "Experiment Results | Location radius Uplift",
    href: "https://myseek.atlassian.net/wiki/spaces/EXP",
    type: "Confluence",
    updated: "2026",
    freshness: "Current",
    authority: "Official — adjacent",
    supports: "Radius adoption vs apply-start lesson",
  },
  {
    title: "Candidate_Discover_Optimise Search Filters_Evaluative",
    href: "https://myseek.atlassian.net/wiki/spaces/AURR/pages/5700651278",
    type: "Confluence",
    updated: "Aug 2026",
    freshness: "Current",
    authority: "Official — adjacent location UX",
    supports: "Q1 filter research, location friction",
  },
  {
    title: "FY27Q2 OKR planning (17 Aug 2026)",
    type: "Zoom",
    updated: "17 Aug 2026",
    freshness: "Current",
    authority: "Informal",
    supports: "Discovery framing, DA ask",
  },
  {
    title: "Search – Q2 Design Discussion",
    href: "https://outlook.office.com/calendar/event/040000008200E00074C5B7101A82E008000000000B2F01721B2EDD0100000000000000001000000037858874A71D4849B9B345FC2A0CF40D",
    type: "Calendar",
    updated: "20 Aug 2026",
    freshness: "Current",
    authority: "Informal",
    supports: "20 Aug design brief audience",
  },
]

function freshnessBadgeTone(freshness: Freshness): "positive" | "caution" | "critical" | "neutral" {
  if (freshness === "Current") return "positive"
  if (freshness === "Aging") return "caution"
  return "critical"
}

function authorityBadgeTone(authority: string): "positive" | "caution" | "critical" | "neutral" | "info" {
  if (authority.startsWith("Official")) return "positive"
  if (authority.startsWith("Semi-official")) return "caution"
  if (authority.includes("Informal")) return "neutral"
  return "info"
}

function SourceListItem({ source }: { source: SourceEntry }) {
  return (
    <ListItem>
      <Stack space="xsmall">
        <Text>
          {source.href ? (
            <TextLink href={source.href} target="_blank" rel="noopener noreferrer">
              {source.title}
            </TextLink>
          ) : (
            <Strong>{source.title}</Strong>
          )}
        </Text>
        <Secondary>
          {source.type} · Updated {source.updated} · {source.authority}
        </Secondary>
        <Text size="small">{source.supports}</Text>
        <div>
          <Badge tone={freshnessBadgeTone(source.freshness)}>{source.freshness}</Badge>
          {" "}
          <Badge tone={authorityBadgeTone(source.authority)}>{source.type}</Badge>
        </div>
      </Stack>
    </ListItem>
  )
}

function FramingColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Column>
      <Card>
        <Stack space="medium">
          <Heading level="3">{title}</Heading>
          {children}
        </Stack>
      </Card>
    </Column>
  )
}

/** Discovery board — Problem / Impact / Customers + sourced evidence. Not a SERP prototype. */
export function MultiLocationFramingPage(_props: ConceptPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FA] via-[#F7F9FC] to-white py-10">
      <PageBlock width="full">
      <Stack space="large">
        <Stack space="small">
          <Heading level="1">Multi-location Search</Heading>
          <Text>Problem → Impact → Customers · discovery framing board</Text>
        </Stack>

        <Alert tone="caution">
          <Strong>Need is current; scale is not.</Strong> Do not size FY27 key results from 2022 saved-search
          percentages until DA returns repeat-location session data.
        </Alert>

        <Columns space="gutter" collapseBelow="desktop">
          <FramingColumn title="Problem">
            <Stack space="medium">
              <div className="flex flex-wrap gap-2">
                <Badge tone="info">Talent Discovery</Badge>
                <Badge tone="info">Explorer</Badge>
                <Badge tone="info">Search</Badge>
              </div>
              <Secondary>Designer: Bennett Tsai</Secondary>

              <Stack space="xsmall">
                <Heading level="4">Current state</Heading>
                <Text>
                  Unified candidate search supports <Strong>one location only</Strong>. Product: &ldquo;Multiple
                  locations is unavailable currently.&rdquo; JobsDB previously allowed multi-select; APAC
                  unification mapped legacy URLs to a single place or dropped location. Career Agent concatenates
                  places and returns a blank SRP (
                  <TextLink href="https://myseek.atlassian.net/browse/AGNT-140">AGNT-140</TextLink>).
                </Text>
              </Stack>

              <Stack space="xsmall">
                <Heading level="4">Problem statement</Heading>
                <Text>
                  Candidates who would take the same role in more than one city, suburb, or region must repeat the
                  search location by location. Multi-location search means one keyword and the same filters across
                  several places in a single search — not hirer posting, not radius, not multi-posted ad display.
                </Text>
              </Stack>

              <Alert tone="critical">
                <Strong>AGNT-140</Strong> — Agentic multi-place searches blank the SRP today.
              </Alert>
            </Stack>
          </FramingColumn>

          <FramingColumn title="Impact">
            <Stack space="medium">
              <div className="grid grid-cols-3 gap-4">
                <Stack space="xxsmall">
                  <Heading level="4">Amber / 7</Heading>
                  <Secondary>Confidence</Secondary>
                </Stack>
                <Stack space="xxsmall">
                  <Heading level="4">Discovery</Heading>
                  <Secondary>Phase only</Secondary>
                </Stack>
                <Stack space="xxsmall">
                  <Heading level="4">Max 5</Heading>
                  <Secondary>Locations (assumption)</Secondary>
                </Stack>
              </div>

              <Divider />

              <Stack space="xsmall">
                <Heading level="4">OKR / STG</Heading>
                <Text>
                  Help candidates search across multiple cities, suburbs, or regions in a single search, increasing
                  application starts. All platforms · All markets.
                </Text>
                <List type="bullet" space="small">
                  <ListItem>Increase application starts per multi-location search vs control</ListItem>
                  <ListItem>Increase search-session → first application rate</ListItem>
                </List>
                <Secondary>X% unbaselined until DA returns repeat-location session data.</Secondary>
              </Stack>

              <Stack space="xsmall">
                <Heading level="4">Metrics we want to shift</Heading>
                <List type="bullet" space="small">
                  <ListItem>
                    <Strong>Customers:</Strong> fewer repeated where-box searches; one view of the same role across
                    places; valid Agent SRP; faster path to first apply.
                  </ListItem>
                  <ListItem>
                    <Strong>Product:</Strong> multi-location URL/title/canonical; saved search stores place list;
                    Concept A vs B test; same radius on every place.
                  </ListItem>
                  <ListItem>
                    <Strong>SEEK:</Strong> more apply starts; fewer repeat location searches; recall guardrail;
                    restore JobsDB capability without 2022 sizing.
                  </ListItem>
                </List>
              </Stack>

              <Alert tone="info">
                <Strong>Adjacent — radius experiment.</Strong> +361% adoption without apply-start lift. Multi-location
                expands places — still needs a recall guardrail.
              </Alert>
            </Stack>
          </FramingColumn>

          <FramingColumn title="Customers">
            <Stack space="medium">
              <Stack space="xsmall">
                <Heading level="4">High-level JTBD</Heading>
                <List type="bullet" space="small">
                  <ListItem>
                    When I would take this role in more than one place, let me search those places in one go.
                  </ListItem>
                  <ListItem>Help me see relevant jobs across the places I will actually go, quickly.</ListItem>
                  <ListItem>
                    Let me search a specific set of cities, suburbs, or regions — not the whole country, not one
                    suburb only.
                  </ListItem>
                </List>
              </Stack>

              <Stack space="xsmall">
                <Heading level="4">Key insights</Heading>
                <Text>
                  HK GTM Jan–Mar 2026 (1 item): &ldquo;job search-multi location should be added.&rdquo; 2022
                  saved-search ceilings are stale — do not size KRs. Radius beside the where-box is adjacent, not
                  multi-location.
                </Text>
              </Stack>

              <Stack space="xsmall">
                <Heading level="4">Motivations</Heading>
                <Text>
                  Commute flexibility and multi-hub work; compare job density across districts; agentic users ask for
                  the same role in several named places in one utterance.
                </Text>
              </Stack>

              <Stack space="xsmall">
                <Heading level="4">Barriers</Heading>
                <Text>
                  Single-location UI; unification removed JobsDB multi-select; Agent has no valid multi-location URL;
                  no repeat-location metric; SEO assumes one location per path.
                </Text>
              </Stack>

              <Alert tone="critical">
                <Strong>Metric gap.</Strong> No baseline for same keyword with 2+ distinct locations within 30 minutes.
              </Alert>
            </Stack>
          </FramingColumn>
        </Columns>

        <Card>
          <Stack space="medium">
            <Heading level="2">Sources</Heading>
            <Text>
              Every Glean-backed claim on this board — with freshness and authority for vetting.
            </Text>
            <List type="bullet" space="medium">
              {SOURCES.map((source) => (
                <SourceListItem key={source.title} source={source} />
              ))}
            </List>
          </Stack>
        </Card>
      </Stack>
      </PageBlock>
    </div>
  )
}
