"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { IconSettings, IconDelete, IconEdit, IconCopy, IconLocation } from "@/components/braid/icons"
import {
  Box,
  Text,
  Heading,
  Button,
  Stack,
  Inline,
  Columns,
  Column,
  Card,
  TextField,
  Textarea,
  Checkbox,
  Badge,
  Alert,
  Divider,
  Loader,
  Rating,
  Accordion,
  AccordionItem,
  Disclosure,
  Dialog,
  Drawer,
  TabsProvider,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  Toggle,
  RadioGroup,
  RadioItem,
  Select,
  Avatar,
  Tooltip,
  Notice,
  List,
  ListItem,
  TickList,
  TickListItem,
  Pagination,
  Tag,
  ButtonLink,
  OverflowMenu,
  MenuItem,
  MenuItemCheckbox,
  MenuItemDivider,
  Dropdown,
  MonthPicker,
  FieldLabel,
  FieldMessage,
  TextDropdown,
  PasswordField,
  SearchField,
  Tiles,
  IconButton,
  Secondary,
  Strong,
  Actions,
  ToastProvider,
  useToast,
} from "@/components/braid"

function ToastDemo() {
  const { showToast } = useToast()

  return (
    <Inline space="small">
      <Button
        onClick={() =>
          showToast({
            message: "Success!",
            description: "Your changes have been saved.",
            tone: "positive",
          })
        }
      >
        Show Success Toast
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          showToast({
            message: "Error occurred",
            description: "Please try again later.",
            tone: "critical",
          })
        }
      >
        Show Error Toast
      </Button>
    </Inline>
  )
}

export default function ComponentsPage() {
  const [textValue, setTextValue] = useState("")
  const [textareaValue, setTextareaValue] = useState("")
  const [isChecked, setIsChecked] = useState(false)
  const [showAlert, setShowAlert] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toggleChecked, setToggleChecked] = useState(false)
  const [radioValue, setRadioValue] = useState("option1")
  const [selectValue, setSelectValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [tags, setTags] = useState(["React", "TypeScript", "Next.js"])
  const [dropdownValue, setDropdownValue] = useState("")
  const [monthPickerValue, setMonthPickerValue] = useState<{ month?: number; year?: number }>({})
  const [passwordValue, setPasswordValue] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [textDropdownValue, setTextDropdownValue] = useState("option1")
  const [menuCheckbox1, setMenuCheckbox1] = useState(false)
  const [menuCheckbox2, setMenuCheckbox2] = useState(true)

  return (
    <ToastProvider>
      <MainLayout>
        <Box padding="gutter">
          <Stack space="xlarge">
            <Box>
              <Heading level="1">Braid Design System Components</Heading>
              <Text tone="secondary">A comprehensive component library based on SEEK&apos;s Braid Design System</Text>
            </Box>

            <Divider />

            {/* Typography */}
            <Stack space="large">
              <Heading level="2">Typography</Heading>
              <Card>
                <Stack space="medium">
                  <Heading level="1">Heading Level 1</Heading>
                  <Heading level="2">Heading Level 2</Heading>
                  <Heading level="3">Heading Level 3</Heading>
                  <Heading level="4">Heading Level 4</Heading>
                  <Text>Standard text content</Text>
                  <Text size="large">Large text content</Text>
                  <Text size="small">Small text content</Text>
                  <Text tone="secondary">Secondary text</Text>
                  <Text tone="critical">Critical text</Text>
                  <Text tone="positive">Positive text</Text>
                  <Text>
                    Text with <Secondary>secondary inline</Secondary> and <Strong>strong inline</Strong> elements
                  </Text>
                </Stack>
              </Card>
            </Stack>

            <Divider />

            {/* Buttons */}
            <Stack space="large">
              <Heading level="2">Buttons</Heading>
              <Card>
                <Stack space="medium">
                  <Heading level="4">Variants</Heading>
                  <Inline space="small">
                    <Button>Solid</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="soft">Soft</Button>
                    <Button variant="transparent">Transparent</Button>
                  </Inline>

                  <Heading level="4">Tones</Heading>
                  <Inline space="small">
                    <Button tone="formAccent">Form Accent</Button>
                    <Button tone="brandAccent">Brand Accent</Button>
                    <Button tone="critical">Critical</Button>
                    <Button tone="neutral">Neutral</Button>
                  </Inline>

                  <Heading level="4">Sizes</Heading>
                  <Inline space="small">
                    <Button size="small">Small</Button>
                    <Button size="standard">Standard</Button>
                    <Button size="large">Large</Button>
                  </Inline>

                  <Heading level="4">States</Heading>
                  <Inline space="small">
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                    <Button icon={<IconSettings size="small" />}>With Icon</Button>
                  </Inline>

                  <Heading level="4">Button Link</Heading>
                  <Inline space="small">
                    <ButtonLink href="#">Link Button</ButtonLink>
                    <ButtonLink href="#" variant="ghost">
                      Ghost Link
                    </ButtonLink>
                  </Inline>

                  <Heading level="4">Icon Buttons</Heading>
                  <Inline space="small">
                    <IconButton label="Edit" icon={<IconEdit size="standard" />} />
                    <IconButton label="Delete" icon={<IconDelete size="standard" />} tone="critical" />
                    <IconButton label="Copy" icon={<IconCopy size="standard" />} variant="soft" tone="formAccent" />
                    <IconButton label="Settings" icon={<IconSettings size="standard" />} variant="solid" />
                  </Inline>

                  <Heading level="4">Actions</Heading>
                  <Actions>
                    <Button>Primary Action</Button>
                    <Button variant="ghost">Secondary Action</Button>
                    <Button variant="transparent">Cancel</Button>
                  </Actions>
                </Stack>
              </Card>
            </Stack>

            <Divider />

            {/* Form Fields */}
            <Stack space="large">
              <Heading level="2">Form Fields</Heading>
              <Card>
                <Stack space="medium">
                  <TextField
                    label="Text Field"
                    description="Enter your name"
                    value={textValue}
                    onChange={setTextValue}
                    placeholder="John Doe"
                  />

                  <PasswordField
                    label="Password Field"
                    description="Enter your password"
                    value={passwordValue}
                    onChange={setPasswordValue}
                    placeholder="Enter password"
                  />

                  <SearchField
                    label="Search Field"
                    value={searchValue}
                    onChange={setSearchValue}
                    onClear={() => setSearchValue("")}
                    placeholder="Search for jobs..."
                  />

                  <Textarea
                    label="Textarea"
                    description="Tell us about yourself"
                    value={textareaValue}
                    onChange={setTextareaValue}
                    placeholder="Write something..."
                  />

                  <Select
                    id="select-demo"
                    label="Select"
                    value={selectValue}
                    onChange={setSelectValue}
                    placeholder="Choose an option"
                    options={[
                      { value: "option1", label: "Option 1" },
                      { value: "option2", label: "Option 2" },
                      { value: "option3", label: "Option 3" },
                    ]}
                  />

                  <Dropdown
                    label="Dropdown"
                    secondaryLabel="optional"
                    description="Select your preferred location"
                    value={dropdownValue}
                    onChange={setDropdownValue}
                    placeholder="Select location"
                    icon={<IconLocation size="standard" />}
                    options={[
                      { value: "sydney", label: "Sydney" },
                      { value: "melbourne", label: "Melbourne" },
                      { value: "brisbane", label: "Brisbane" },
                    ]}
                  />

                  <MonthPicker
                    label="Month Picker"
                    description="Select your start date"
                    value={monthPickerValue}
                    onChange={setMonthPickerValue}
                    minYear={2020}
                    maxYear={2030}
                  />

                  <Checkbox
                    label="Checkbox"
                    description="I agree to the terms"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />

                  <Toggle label="Toggle switch" checked={toggleChecked} onChange={setToggleChecked} />

                  <RadioGroup label="Radio Group" value={radioValue} onChange={setRadioValue}>
                    <RadioItem value="option1" label="Option 1" />
                    <RadioItem value="option2" label="Option 2" />
                    <RadioItem value="option3" label="Option 3" />
                  </RadioGroup>

                  <Stack space="small">
                    <Heading level="4">Field Label (for custom fields)</Heading>
                    <FieldLabel
                      htmlFor="custom-field"
                      label="Custom Field"
                      secondaryLabel="optional"
                      description="This is a custom field label"
                    />
                    <input
                      id="custom-field"
                      type="text"
                      className="w-full rounded-md border-2 border-[#878f9b] px-3 py-2.5"
                      placeholder="Custom input"
                    />
                    <FieldMessage id="custom-field-message" message="This is a field message" tone="neutral" />
                  </Stack>
                </Stack>
              </Card>
            </Stack>

            <Divider />

            {/* Dropdown Menus */}
            <Stack space="large">
              <Heading level="2">Menus</Heading>
              <Card>
                <Stack space="medium">
                  <Heading level="4">Overflow Menu</Heading>
                  <Inline space="medium">
                    <OverflowMenu label="More options">
                      <MenuItem icon={<IconEdit size="small" />}>Edit</MenuItem>
                      <MenuItem icon={<IconCopy size="small" />}>Duplicate</MenuItem>
                      <MenuItemDivider />
                      <MenuItem icon={<IconDelete size="small" />} tone="critical">
                        Delete
                      </MenuItem>
                    </OverflowMenu>

                    <OverflowMenu label="Options with checkboxes" size="small">
                      <MenuItemCheckbox checked={menuCheckbox1} onChange={setMenuCheckbox1}>
                        Show completed
                      </MenuItemCheckbox>
                      <MenuItemCheckbox checked={menuCheckbox2} onChange={setMenuCheckbox2}>
                        Show archived
                      </MenuItemCheckbox>
                    </OverflowMenu>
                  </Inline>

                  <Heading level="4">Text Dropdown</Heading>
                  <Text>
                    Sort by:{" "}
                    <TextDropdown
                      label="Sort options"
                      value={textDropdownValue}
                      onChange={setTextDropdownValue}
                      options={[
                        { value: "option1", label: "Date" },
                        { value: "option2", label: "Relevance" },
                        { value: "option3", label: "Salary" },
                      ]}
                    />
                  </Text>
                </Stack>
              </Card>
            </Stack>

            <Divider />

            {/* Layout */}
            <Stack space="large">
              <Heading level="2">Layout</Heading>
              <Card>
                <Stack space="medium">
                  <Heading level="4">Columns</Heading>
                  <Columns space="medium">
                    <Column>
                      <Box background="brand" padding="medium">
                        <Text>Column 1</Text>
                      </Box>
                    </Column>
                    <Column>
                      <Box background="brandAccent" padding="medium">
                        <Text>Column 2</Text>
                      </Box>
                    </Column>
                    <Column>
                      <Box background="formAccent" padding="medium">
                        <Text>Column 3</Text>
                      </Box>
                    </Column>
                  </Columns>

                  <Heading level="4">Tiles</Heading>
                  <Tiles columns={3} space="small">
                    <Box background="neutral" padding="medium">
                      <Text align="center">Tile 1</Text>
                    </Box>
                    <Box background="neutral" padding="medium">
                      <Text align="center">Tile 2</Text>
                    </Box>
                    <Box background="neutral" padding="medium">
                      <Text align="center">Tile 3</Text>
                    </Box>
                    <Box background="neutral" padding="medium">
                      <Text align="center">Tile 4</Text>
                    </Box>
                    <Box background="neutral" padding="medium">
                      <Text align="center">Tile 5</Text>
                    </Box>
                    <Box background="neutral" padding="medium">
                      <Text align="center">Tile 6</Text>
                    </Box>
                  </Tiles>

                  <Heading level="4">Inline</Heading>
                  <Inline space="small">
                    <Badge>Badge 1</Badge>
                    <Badge tone="positive">Badge 2</Badge>
                    <Badge tone="critical">Badge 3</Badge>
                  </Inline>
                </Stack>
              </Card>
            </Stack>

            <Divider />

            {/* Feedback */}
            <Stack space="large">
              <Heading level="2">Feedback</Heading>
              <Card>
                <Stack space="medium">
                  {showAlert && (
                    <Alert tone="info" onClose={() => setShowAlert(false)}>
                      This is an informational alert message.
                    </Alert>
                  )}
                  <Alert tone="positive">This is a positive alert message.</Alert>
                  <Alert tone="critical">This is a critical alert message.</Alert>
                  <Alert tone="caution">This is a caution alert message.</Alert>

                  <Heading level="4">Notice</Heading>
                  <Notice tone="info">This is an informational notice with an icon.</Notice>
                  <Notice tone="positive">This is a positive notice.</Notice>
                  <Notice tone="critical">This is a critical notice.</Notice>

                  <Heading level="4">Toast Notifications</Heading>
                  <ToastDemo />

                  <Heading level="4">Loader</Heading>
                  <Inline space="medium">
                    <Loader size="small" />
                    <Loader />
                    <Loader size="large" />
                  </Inline>
                </Stack>
              </Card>
            </Stack>

            <Divider />

            {/* Data Display */}
            <Stack space="large">
              <Heading level="2">Data Display</Heading>
              <Card>
                <Stack space="medium">
                  <Heading level="4">Badges</Heading>
                  <Inline space="small">
                    <Badge>Default</Badge>
                    <Badge tone="positive">Positive</Badge>
                    <Badge tone="critical">Critical</Badge>
                    <Badge tone="caution">Caution</Badge>
                    <Badge tone="info">Info</Badge>
                    <Badge tone="neutral">Neutral</Badge>
                  </Inline>

                  <Heading level="4">Tags</Heading>
                  <Inline space="small">
                    {tags.map((tag) => (
                      <Tag key={tag} onClear={() => setTags(tags.filter((t) => t !== tag))}>
                        {tag}
                      </Tag>
                    ))}
                  </Inline>

                  <Heading level="4">Rating</Heading>
                  <Inline space="medium">
                    <Rating value={3.5} />
                    <Rating value={5} size="large" />
                  </Inline>

                  <Heading level="4">Avatar</Heading>
                  <Inline space="medium">
                    <Avatar name="John Doe" size="small" />
                    <Avatar name="Jane Smith" />
                    <Avatar name="Bob Wilson" size="large" />
                    <Avatar src="/diverse-avatars.png" />
                  </Inline>

                  <Heading level="4">Tooltip</Heading>
                  <Inline space="medium">
                    <Tooltip content="This is helpful information">
                      <Button variant="ghost">Hover me</Button>
                    </Tooltip>
                    <Tooltip content="Another tooltip" placement="right">
                      <Button variant="soft">Right tooltip</Button>
                    </Tooltip>
                  </Inline>
                </Stack>
              </Card>
            </Stack>

            <Divider />

            {/* Lists */}
            <Stack space="large">
              <Heading level="2">Lists</Heading>
              <Card>
                <Columns space="large">
                  <Column>
                    <Stack space="small">
                      <Heading level="4">Bullet List</Heading>
                      <List>
                        <ListItem>First item</ListItem>
                        <ListItem>Second item</ListItem>
                        <ListItem>Third item</ListItem>
                      </List>
                    </Stack>
                  </Column>
                  <Column>
                    <Stack space="small">
                      <Heading level="4">Tick List</Heading>
                      <TickList>
                        <TickListItem>Feature one</TickListItem>
                        <TickListItem>Feature two</TickListItem>
                        <TickListItem>Feature three</TickListItem>
                      </TickList>
                    </Stack>
                  </Column>
                </Columns>
              </Card>
            </Stack>

            <Divider />

            {/* Navigation */}
            <Stack space="large">
              <Heading level="2">Navigation</Heading>
              <Card>
                <Stack space="medium">
                  <Heading level="4">Pagination</Heading>
                  <Pagination page={currentPage} total={10} onChange={setCurrentPage} />
                </Stack>
              </Card>
            </Stack>

            <Divider />

            {/* Accordion & Disclosure */}
            <Stack space="large">
              <Heading level="2">Accordion & Disclosure</Heading>
              <Card>
                <Stack space="medium">
                  <Heading level="4">Accordion</Heading>
                  <Accordion>
                    <AccordionItem id="item1" label="What is Braid?">
                      Braid is SEEK&apos;s design system, providing a set of React components and design patterns for
                      building consistent user interfaces.
                    </AccordionItem>
                    <AccordionItem id="item2" label="How do I get started?">
                      You can start by installing the Braid design system package and importing the components you need.
                    </AccordionItem>
                    <AccordionItem id="item3" label="Is it accessible?">
                      Yes! All Braid components are built with accessibility in mind and follow WCAG guidelines.
                    </AccordionItem>
                  </Accordion>

                  <Heading level="4">Disclosure</Heading>
                  <Disclosure id="disclosure1" label="Show more details">
                    <Text>Here are additional details that were hidden until you clicked the disclosure trigger.</Text>
                  </Disclosure>
                </Stack>
              </Card>
            </Stack>

            <Divider />

            {/* Tabs */}
            <Stack space="large">
              <Heading level="2">Tabs</Heading>
              <Card>
                <TabsProvider>
                  <Tabs label="Example tabs">
                    <Tab>Overview</Tab>
                    <Tab>Details</Tab>
                    <Tab>Reviews</Tab>
                  </Tabs>
                  <TabPanels>
                    <TabPanel>
                      <Box paddingY="medium">
                        <Text>This is the overview content.</Text>
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <Box paddingY="medium">
                        <Text>These are the details.</Text>
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <Box paddingY="medium">
                        <Text>Here are the reviews.</Text>
                      </Box>
                    </TabPanel>
                  </TabPanels>
                </TabsProvider>
              </Card>
            </Stack>

            <Divider />

            {/* Dialog & Drawer */}
            <Stack space="large">
              <Heading level="2">Dialog & Drawer</Heading>
              <Card>
                <Inline space="medium">
                  <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
                  <Button variant="ghost" onClick={() => setDrawerOpen(true)}>
                    Open Drawer
                  </Button>
                </Inline>
              </Card>
            </Stack>

            <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              title="Example Dialog"
              description="This is an example dialog with some content."
            >
              <Stack space="medium">
                <Text>Dialog content goes here. You can put any content inside a dialog.</Text>
                <Inline space="small">
                  <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                </Inline>
              </Stack>
            </Dialog>

            <Drawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              title="Example Drawer"
              description="This drawer slides in from the side."
            >
              <Stack space="medium">
                <Text>Drawer content can include forms, lists, or any other content.</Text>
                <TextField label="Name" value="" onChange={() => {}} placeholder="Enter name" />
                <Button onClick={() => setDrawerOpen(false)}>Close</Button>
              </Stack>
            </Drawer>
          </Stack>
        </Box>
      </MainLayout>
    </ToastProvider>
  )
}
