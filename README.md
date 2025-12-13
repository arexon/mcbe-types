# MCBE-Types

A (VERY WIP) TypeScript library for the Minecraft Bedrock Add-On format.

## Motivation

The goal of this library is to provide type implementations for _everything_ in
the Add-On format to enable high-level tools to build generators, templating
systems, and APIs on top of it without needing to maintain the types themselves.

Backward compatibility for older Add-On formats will **not** be supported due to
the sheer scale of the effort and time required. However, a minimum supported
format version will be picked (most likely 1.26.x) as the basis for future
backward compatibility. This means the library's API will not introduce breaking
changes to already existing code written in prior versions.

For now, the library will not offer much (hence "WIP" being plastered
everywhere). Small incremental additions will be made until we reach a
semi-usable state, at which point, the library will get published to
[JSR](https://jsr.io/).
