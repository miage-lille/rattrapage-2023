import { Ennemy, Player, Input, Shape, DomainError, Fighting, Chasing, Dead, RunningTo } from "./types";
import * as E from "fp-ts/lib/Either";
import { Either } from "fp-ts/lib/Either";


export const whenReachPlayer: (e: Ennemy, p: Player) => Either<DomainError, Ennemy<Fighting>> = (e, p) => {
  switch (e.state.kind) {
    case "CHASING":
      return E.right({ ...e, state: { kind: "FIGHTING", player: p } });
    default:
      return E.left("UNREACHABLE_STATE");
  }
}

export const whenDetect: (e: Ennemy, p: Player) => Either<DomainError, Ennemy<Chasing>> = (e, p) => {
  switch (e.state.kind) {
    case "PATROLLING":
      return E.right({ ...e, state: { kind: "CHASING", target: p } });
    default:
      return E.left("UNREACHABLE_STATE");
  }
}

export const whenAttack: (e: Ennemy, p: Player) => Either<DomainError, Ennemy<Fighting>> = (e, p) => {
  switch (e.state.kind) {
    case "FIGHTING": {
      const updatedPlayer = { ...p, health: p.health - 1 }
      return E.right({ ...e, state: { kind: "FIGHTING", player: updatedPlayer } });
    }
    default:
      return E.left("UNREACHABLE_STATE");
  }
}

export const whenDoubleAttack: (e: Ennemy, p: Player) => Either<DomainError, Ennemy<Fighting>> = (e, p) => {
  switch (e.state.kind) {
    case "FIGHTING": {
      const updatedPlayer = { ...p, health: p.health - 2 }
      return E.right({ ...e, state: { kind: "FIGHTING", player: p } });
    }
    default:
      return E.left("UNREACHABLE_STATE");
  }
}

export const whenHitted: (e: Ennemy, damage: number, p: Player) => Either<DomainError, Ennemy<Dead | Fighting>> = (e, damage, p) => {
  switch (e.state.kind) {
    case "PATROLLING":
    case "CHASING":
    case "FIGHTING": {
      if (damage < 0) {
        return E.left("NO_HEAL_ALLOWED")
      }
      const remainingHealth = e.health - damage;
      if (remainingHealth > 0) {
        return E.right({ ...e, health: remainingHealth, state: { kind: "FIGHTING", player: p } });
      } else {
        return whenDie(e)
      }
    }
    default:
      return E.left("UNREACHABLE_STATE");
  }
}

export const whenDie: (e: Ennemy) => Either<DomainError, Ennemy<Dead>> = (e) => {
  switch (e.state.kind) {
    case "PATROLLING":
    case "FIGHTING": {
      return E.right({ ...e, state: { kind: "DEAD" } });
    }
    default:
      return E.left("UNREACHABLE_STATE");
  }
}

export const whenLost: (e: Ennemy) => Either<DomainError, Ennemy<RunningTo>> = (e) => {
  switch (e.state.kind) {
    case "CHASING": {
      return E.right({ ...e, state: { kind: "RUNNING_TO", goal: e.initialPosition } });
    }
    default:
      return E.left("UNREACHABLE_STATE");
  }
}

export const whenEscape: (e: Ennemy) => Either<DomainError, Ennemy<Chasing>> = (e) => {
  switch (e.state.kind) {
    case "FIGHTING": {
      const p = (<Ennemy<Fighting>>e).state.player;
      return E.right({ ...e, state: { kind: "CHASING", target: p } });
    }
    default:
      return E.left("UNREACHABLE_STATE");
  }
}

export const whenKill: (e: Ennemy) => Either<DomainError, Ennemy<RunningTo>> = (e) => {
  switch (e.state.kind) {
    case "FIGHTING": {
      return E.right({ ...e, state: { kind: "RUNNING_TO", goal: e.initialPosition } });
    }
    default:
      return E.left("UNREACHABLE_STATE");
  }
}

export const whenReachGoal: (e: Ennemy) => Either<DomainError, Ennemy> = (e) => {
  switch (e.state.kind) {
    case "RUNNING_TO": {
      const defaultShape: Shape = [
        e.position,
        [e.position[0], e.position[1] + 10],
        [e.position[0] + 15, e.position[1] + 10],
        [e.position[0] + 15, e.position[1]],
        [e.position[0], e.position[1]]];
      return E.right({ ...e, state: { kind: "PATROLLING", area: defaultShape } });
    }
    default:
      return E.left("UNREACHABLE_STATE");
  }
}

export const updateEnnemy: (e: Ennemy, i: Input) => Either<DomainError, Ennemy> = (who, what) => {
  switch (what.kind) {
    case "Attack": return whenAttack(who, what.player);
    case "Detect": return whenDetect(who, what.player)
    case "Die": return whenDie(who)
    case "DoubleAttack": return whenDoubleAttack(who, what.player)
    case "Escape": return whenEscape(who)
    case "Hitted": return whenHitted(who, what.damage, what.player)
    case "Kill": return whenKill(who)
    case "Lost": return whenLost(who)
    case "ReachPlayer": return whenReachPlayer(who, what.player)
    case "ReachGoal": return whenReachGoal(who);
  }

}