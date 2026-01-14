
import { AuthKit } from "@convex-dev/workos-authkit";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

// Note: These env vars must be set in the Convex dashboard for the app to function.
// We provide dummy values here only to prevent analysis failure if they are initially missing.
export const authKit = new AuthKit<DataModel>(components.workOSAuthKit);
