export type Point = [number, number]
export type Shape = Array<Point>;

export type Player = {
  id: number,
  position: Point,
  health: number
}

export const createPlayer: (id: number, p: Point, health: number) => Player =
  (id, p, h) => ({ id: id, position: p, health: h });

export type Patrolling = {
  kind: "PATROLLING",
  area: Shape
}

export type Fighting = {
  kind: "FIGHTING",
  player: Player
}

export type Chasing = {
  kind: "CHASING",
  target: Player
}

export type RunningTo = {
  kind: "RUNNING_TO",
  goal: Point
}

export type Dead = {
  kind: 'DEAD'
}

export type EnnemyState = Patrolling | Chasing | Fighting | RunningTo | Dead;


export type Ennemy<T extends EnnemyState | { kind: unknown } = { kind: unknown }> = {
  id: number,
  initialPosition: Point,
  position: Point,
  health: number
  state: T
}

export const createEnnemy: (id: number, p: Point, a: Shape) => Ennemy =
  (id, p, a) => ({ id: id, initialPosition: p, position: p, health: 10, state: { kind: "PATROLLING", area: a } });

export type Input =
  {
    kind: "Detect", //The Ennemy detects a Player
    player: Player
  } |
  {
    kind: "ReachPlayer", //The Ennemy reaches a Player
    player: Player
  } |
  {
    kind: "Attack", //The Ennemy attacks a Player
    player: Player
  } |
  {
    kind: "DoubleAttack", //The Ennemy provides 2 attacks to a Player
    player: Player
  } |
  {
    kind: "Hitted", //The Ennemy is hitted by a Player
    damage: number,
    player: Player
  } |
  {
    kind: "Die" //The Ennemy Dies
  } |
  {
    kind: "Lost" //The Ennemy lost the player that he was chasing
  } |
  {
    kind: "Escape" //The Player escape the fight
  } |
  {
    kind: "Kill" // The Ennemy kills the Player
  } |
  {
    kind: "ReachGoal" // The Ennemy reaches the targeted goal
  }

export type DomainError = "UNREACHABLE_STATE" | "NO_HEAL_ALLOWED"