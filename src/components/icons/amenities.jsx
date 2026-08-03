// Barrel re-export from individual .tsx files.
// Each icon lives in its own .tsx file matching upstream pqoqubbw/icons format,
// so they can be directly copied/updated from the GitHub repo.

import { KeyIcon } from './key.tsx'
import { DropletIcon } from './droplet.tsx'
import { ActivityIcon } from './activity.tsx'
import { UsersIcon } from './users.tsx'
import { SunIcon } from './sun.tsx'
import { BoxIcon } from './box.tsx'
import { CompassIcon } from './compass.tsx'
import { LaptopMinimalCheckIcon } from './laptop-minimal-check.tsx'
import { FlameIcon } from './flame.tsx'
import { BicepsFlexedIcon } from './biceps-flexed.tsx'
import { WavesIcon } from './waves.tsx'
import { SmileIcon } from './smile.tsx'

const ICON_MAP = {
  key: KeyIcon,
  droplet: DropletIcon,
  activity: ActivityIcon,
  users: UsersIcon,
  sun: SunIcon,
  box: BoxIcon,
  compass: CompassIcon,
  laptop: LaptopMinimalCheckIcon,
  flame: FlameIcon,
  dumbbell: BicepsFlexedIcon,
  waves: WavesIcon,
  smile: SmileIcon,
}

export const amenityIconNames = Object.keys(ICON_MAP)

export {
  KeyIcon,
  DropletIcon,
  ActivityIcon,
  UsersIcon,
  SunIcon,
  BoxIcon,
  CompassIcon,
  LaptopMinimalCheckIcon,
  FlameIcon,
  BicepsFlexedIcon,
  WavesIcon,
  SmileIcon,
}

export default ICON_MAP
