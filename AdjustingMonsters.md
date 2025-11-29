### Reskinning Monsters[¶](https://steelcompendium.io/compendium/main/Bestiary/Monsters/Chapters/Monster%20Basics/#reskinning-monsters "Permanent link")

Even with a book chock full of monsters, you're likely to find yourself wishing you had stat blocks for a specific kind of creature not presented in this book or another monster supplement. You might need snake people, fish people, or a 50-story-tall crab. The good news is that you can modify any of the stat blocks in this book to make new creatures with just a little work!

Use the following tips for reskinning monsters for your game:

- **Description:** You can change any creature's description and use their stat block as-is to create something new. If you want a weretiger instead of a werewolf, odds are that simply describing the werewolf as a tiger-humanoid hybrid and mentally swapping the word "wolf" with "tiger" when you play will get you what you need without changing anything else. Whenever you find an existing creature whose stats are already quite close to what you want, this process is especially easy.
- **Movement and Environment:** Giving a creature the ability to climb or swim at full speed while moving doesn't change their level or challenge. Neither does giving them an aquatic origin or the ability to breathe underwater. You can make these sorts of changes freely to create new mountainous or aquatic variants of different stat blocks, turning demonic gnolls into rampaging fishfolk or cavern-climbing horrors with ease!
- **Damage Types:** You can change damage types for abilities, immunities, and weaknesses easily. Transforming an elemental crux of fire into a crux of acid can be done by swapping all references to fire damage in the stat block to acid damage.
- **Modifiable Stat Blocks:** The stat blocks in the Animals and Rivals sections of this book are meant to be modified, and those sections feature rules for creating new animal and humanoid stat blocks. You can use these stat blocks to create nearly any creature who falls into either of those categories, including many creatures common to fantasy.

### Adjusting Monster Levels[¶](https://steelcompendium.io/compendium/main/Bestiary/Monsters/Chapters/Monster%20Basics/#adjusting-monster-levels "Permanent link")

Each monster in this book was created with the help of handcrafted tables of numbers and the extensive monster-making rules developed for *Draw Steel*. As such, stat blocks aren't intended to be modified or adjusted (with the exception of animals and rivals, as noted above). Your best bet for adjusting any given monster is to find another monster of the level, organization, and role you're looking for, and reskinning that monster while using their statistics.

That said, this section provides formulas you can use to get close to the appropriate EV for a monster of a level you want to create if no stat block feels suitable for reskinning, or if you want a sense of how *Draw Steel* monsters work.

#### Role, Organization, and Damage Modifier[¶](https://steelcompendium.io/compendium/main/Bestiary/Monsters/Chapters/Monster%20Basics/#role-organization-and-damage-modifier "Permanent link")

The following two tables detail how a monster's role and organization affects the numbers in their stat block. These modifiers can be plugged into formulas presented below, along with a monster's expected level.

###### Role and Damage Modifier Table[¶](https://steelcompendium.io/compendium/main/Bestiary/Monsters/Chapters/Monster%20Basics/#role-and-damage-modifier-table "Permanent link")

| Role/Organization | Role Modifier | Damage Modifier |
| ----------------- | ------------- | --------------- |
| Ambusher          | +20           | +1              |
| Artillery         | +10           | +1              |
| Brute             | +30           | +1              |
| Controller        | +10           | +0              |
| Defender          | +30           | +0              |
| Harrier           | +20           | +0              |
| Hexer             | +10           | +0              |
| Mount             | +20           | +0              |
| Support           | +20           | +0              |
| Elite*            | +0            | +1              |
| Leader            | +30           | +1              |
| Solo              | +30           | +2              |

*Elite can be used in conjunction with a role that features a +1 damage modifier, for a total damage modifier of +2.

###### Organization Modifier Table[¶](https://steelcompendium.io/compendium/main/Bestiary/Monsters/Chapters/Monster%20Basics/#organization-modifier-table "Permanent link")

| Organization          | Organization Modifier |
| --------------------- | --------------------- |
| Minion (Stamina only) | x 0.125               |
| Minion                | x 0.5                 |
| Horde                 | x 0.5                 |
| Platoon               | x 1                   |
| Leader                | x 2                   |
| Elite                 | x 2                   |
| Solo (Stamina only)   | x 5                   |
| Solo                  | x 6                   |

#### Encounter Value and Stamina[¶](https://steelcompendium.io/compendium/main/Bestiary/Monsters/Chapters/Monster%20Basics/#encounter-value-and-stamina "Permanent link")

A monster's EV is calculated using the following equation. (The EV for minions represents four minions together.) Round up results to the nearest whole number.

`((2 x Level) + 4) x Organization Modifier`

Monster Stamina can be approximated using the following equation. Round up results to the nearest whole number.

`((10 x Level) + Role Modifier) x Organization Modifier`

If you want your non-minion monster to have additional Stamina, you can add `(3 x Level) + 3` to their total.

#### Damage and Power Roll Tiers[¶](https://steelcompendium.io/compendium/main/Bestiary/Monsters/Chapters/Monster%20Basics/#damage-and-power-roll-tiers "Permanent link")

The baseline damage dealt by a monster's abilities can be approximated using the following equation. Round up all results to the nearest whole number.

`(4 + Level + Damage Modifier) x Tier Modifier`

For horde and minion monsters, divide this result by 2.

If the ability is a strike, add the monster's highest characteristic to the total.

The tier modifier uses a different value for each power roll tier.

`Tier 1 = 0.6 Tier 2 = 1.1 Tier 3 = 1.4`

At higher levels, these values can lead to damage numbers a few points higher than those seen in this book.

#### Characteristics and Abilities[¶](https://steelcompendium.io/compendium/main/Bestiary/Monsters/Chapters/Monster%20Basics/#characteristics-and-abilities "Permanent link")

Additional rules cover a monster's characteristics and additional modifications to their abilities:

- A monster's highest characteristic and power roll bonus is equal to 1 + their echelon. For example, a level 5 goblin (2nd echelon) has a +3 for their highest characteristic.
- A monster who uses potencies in their abilities bases those potencies on their highest characteristic, minus 1 for each tier below tier 3. With a +3 characteristic for our level 5 goblin, their signature ability uses potency language of M < 1 at tier 1, M < 2 at tier 2, and M < 3 at tier 3.
- If a monster is a leader or a solo, increase their highest characteristic and power roll by 1 (to a maximum of +5), and increase their potency values at all tiers by 1 (to a maximum of 6).
- A monster's free strike damage is equal to the damage calculated for a tier 1 outcome for an ability.
- Monster abilities normally target one creature or object. Elite, leader, and solo monsters have abilities that typically target two creatures or objects.
- If you want a monster's ability to target one additional target over what's expected, multiply the damage at all tiers by 0.8. If an ability targets two or more additional targets, multiply the damage by 0.5. If an ability targets one fewer target than expected, multiply the damage by 1.2.
- Plenty more considerations regarding a monster's features and abilities go into creating a new monster. More robust guidance for making new monsters and abilities will appear in the future.
