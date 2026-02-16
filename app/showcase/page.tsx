/**
 * UI COMPONENTS SHOWCASE PAGE
 * Demonstrates all available UI components
 */

"use client";

import { useState } from "react";
import Skeleton, { SkeletonCard } from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Drawer from "@/components/ui/Drawer";
import Tabs from "@/components/ui/Tabs";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import Dialog from "@/components/ui/Dialog";
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ShowcasePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2">
            UI Components Showcase
          </h1>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Components", href: "/showcase" },
              { label: "UI Library" },
            ]}
          />
        </div>

        {/* Alerts */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Alerts</h2>
          <div className="space-y-4">
            {showAlert && (
              <Alert
                variant="info"
                title="Info Alert"
                dismissible
                onDismiss={() => setShowAlert(false)}
              >
                This is an informational message with a dismiss button.
              </Alert>
            )}
            <Alert variant="success" title="Success!">
              Your action was completed successfully.
            </Alert>
            <Alert variant="warning" title="Warning">
              Please be careful with this action.
            </Alert>
            <Alert variant="danger" title="Error">
              Something went wrong. Please try again.
            </Alert>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </section>

        {/* Avatars */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Avatars</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <Avatar fallback="AM" size="xs" />
            <Avatar fallback="FA" size="sm" status="online" />
            <Avatar fallback="MK" size="md" status="busy" />
            <Avatar fallback="KH" size="lg" status="away" />
            <Avatar fallback="AS" size="xl" status="online" />
          </div>
        </section>

        {/* Tabs */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Tabs</h2>
          <Tabs
            variant="default"
            tabs={[
              {
                id: "overview",
                label: "Overview",
                content: (
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Overview Tab</h3>
                    <p className="text-foreground-muted">
                      This is the overview content with useful information.
                    </p>
                  </Card>
                ),
              },
              {
                id: "details",
                label: "Details",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                content: (
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Details Tab</h3>
                    <p className="text-foreground-muted">
                      Detailed information goes here.
                    </p>
                  </Card>
                ),
              },
              {
                id: "settings",
                label: "Settings",
                content: (
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Settings Tab</h3>
                    <p className="text-foreground-muted">
                      Configure your preferences here.
                    </p>
                  </Card>
                ),
              },
            ]}
          />

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Pills Variant</h3>
            <Tabs
              variant="pills"
              tabs={[
                {
                  id: "tab1",
                  label: "Tab 1",
                  content: <div className="p-4">Content for tab 1</div>,
                },
                {
                  id: "tab2",
                  label: "Tab 2",
                  content: <div className="p-4">Content for tab 2</div>,
                },
                {
                  id: "tab3",
                  label: "Tab 3",
                  content: <div className="p-4">Content for tab 3</div>,
                },
              ]}
            />
          </div>
        </section>

        {/* Tooltips */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Tooltips</h2>
          <div className="flex gap-4">
            <Tooltip content="This is a top tooltip" position="top">
              <Button>Hover (Top)</Button>
            </Tooltip>
            <Tooltip content="This is a bottom tooltip" position="bottom">
              <Button variant="outline">Hover (Bottom)</Button>
            </Tooltip>
            <Tooltip content="This is a left tooltip" position="left">
              <Button variant="ghost">Hover (Left)</Button>
            </Tooltip>
            <Tooltip content="This is a right tooltip" position="right">
              <Button variant="outline">Hover (Right)</Button>
            </Tooltip>
          </div>
        </section>

        {/* Spinners */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Spinners</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" variant="accent" />
            <Spinner size="lg" />
            <Spinner size="xl" variant="primary" />
          </div>
        </section>

        {/* Skeletons */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Skeleton Loaders
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton variant="text" className="w-3/4" />
              <Skeleton variant="text" className="w-1/2" />
              <Skeleton variant="rectangular" height={200} className="mt-4" />
            </div>
            <SkeletonCard />
          </div>
        </section>

        {/* Drawer & Dialog Triggers */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Drawer & Dialog
          </h2>
          <div className="flex gap-4">
            <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
            <Button onClick={() => setDialogOpen(true)} variant="outline">
              Open Dialog
            </Button>
          </div>
        </section>
      </div>

      {/* Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Example Drawer"
        position="right"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-foreground-muted">
            This is a drawer component. It slides in from the side and can
            contain any content you want.
          </p>
          <Alert variant="info">
            Drawers are great for displaying additional information or forms
            without leaving the current page.
          </Alert>
          <div className="flex gap-2">
            <Button size="sm">Action</Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDrawerOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Dialog */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Example Dialog"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-foreground-muted">
            This is a dialog component. It appears centered on the screen with
            an overlay background.
          </p>
          <Alert variant="success">
            Dialogs are perfect for important messages or confirmations.
          </Alert>
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm">Confirm</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
