# Home layout: supplied dimensions and remaining assumptions

## Current reviewed model

The user approved implementing the corrected proportion review on 1 November 2026. All conversions use exactly 0.3048 metres per foot.

| Supplied measurement | Interpretation |
| --- | --- |
| Kitchen clear area 6′3″ × 4′3″ | Clear floor between inferred cabinet bands |
| Kitchen partition 4′9″; short wall 2′5″ | Wall segments, not whole-room dimensions |
| Living length 12′6″ | Kitchen-side wall to TV/bedroom partition |
| TV wall 6′10″ | Solid wall segment only; living space continues right |
| Balcony 2′6″ × 13′6″ | Kept longer than the living room |
| Bedroom width 8′10″; clear depth 6′9″ | Depth excludes the doorway zone |
| Bed 5′ × 6′9″ × 1′6″ | Positioned at the upper usable bedroom edge |
| Desk 3′ × 2′ × 2′7″ | Rotated against bedroom right side |
| Washer 1′9″ × 1′9″ × 2′10″ | Upper balcony |
| Fridge 1′10″ × 1′10″ × 3′9″ | Living room near the kitchen-side wall |

Confirmed entry position: left end of the top entry wall; open leaf rests against the left divider. Its width remains inferred.

Inferred allowances retained from the approved review: bathroom about 5′ × 7′6″, bedroom doorway zone about 2′6″, bottom cupboards about 1′3″ deep, upper kitchen counter about 2′ deep, and left cabinet/offset band about 2′7″. Their combination derives an overall width about 13′10″. The balcony-relative notch and other offsets are inferred; an isolated 1′6″ annotation is not applied as a full passage width because endpoints remain unknown. Ceiling height stays at an estimated 2.8 m.

### Data compatibility and validation

Version-3 JSON includes explicit movable furniture sizes and cupboard depth. It saves under home-space-home-v3. The previous home-space-home-v2 record is not overwritten or automatically interpreted using changed geometry; an Export earlier layout button downloads that original record. Imports accept version 3 only and reject invalid or impossible dimensions, duplicate IDs, unknown regions and malformed furniture sizes.

Furniture bounds include the bedroom notch and exclude the fixed cupboards. Fixed objects are reference geometry; collision detection against fixtures or between pieces is not implemented. Editable values are marked Edited layout, while supplied reference measurements stay visible.

Validation: ten automated checks cover the reference lengths, longer balcony, upper bed position, entry anchor, custom desk bounds, oversized-piece rejection, JSON validation and slider limits. npm run build checks production compilation and TypeScript.

### Release and rollback

Review the feature PR before merge. Vercel should deploy the merged main revision; this implementation does not change DNS. Revert the feature commit to restore the previous app. The version-2 browser record remains available to that older release; version-3 records are separate. No database migration is required.

## Historical photo-guided approximation (superseded)

The user supplied a floor-plan sketch and seven photos on 26 October 2026 and asked for estimated dimensions before obtaining measurements. No calibrated reference or known dimension was supplied. These values are working assumptions, not a photogrammetric survey. Perspective, lens distortion and uncertain object sizes prevent a defensible confidence interval; actual dimensions may differ substantially.

| Region | Starting width × length |
| --- | --- |
| Main footprint | 4.8 × 9.6 m |
| Kitchen | 3.1 × 2.5 m |
| Unconfirmed top-right area | 1.7 × 2.5 m |
| Living room | 4.8 × 3.9 m |
| Bedroom | 3.0 × 3.2 m |
| Bathroom | 1.8 × 2.0 m |
| Balcony | 0.9 × 2.5 m |
| Ceiling | 2.8 m |

The sketch supplies adjacency and relative orientation. Familiar object sizes (a roughly 2 m bed, domestic washing machine, chairs and toilet) give only loose visual plausibility checks; they do not establish scale. No exact tile size is assumed. The room dimensions deliberately remain editable and visibly estimated.

The top-right area remains unconfirmed. The strip above the bathroom is treated as access space. Door positions, partition gaps, ceiling height and kitchen fittings are inferred. Kitchen interior photos were not supplied. The bedroom, balcony washing machine, cream walls, grey flooring, TV console/panel, orange seating, drying rack, beanbag, bathroom sanitary fixtures and storage inform procedural geometry and colours. The procedural model is an approximation, not an exact inventory.

The whole-home plan uses localStorage key `home-space-home-v2`. Existing standalone room plans remain under `home-space-v1`, accessible via Room studio. Home JSON exports carry version 2 and include dimensions plus movable furniture. Fixed fixtures and inferred openings derive from room dimensions and are not individually editable yet. Walls are cut away in 3D for visibility; top-down mode shows the footprint.

Original reference photos stay outside the repository and deployment. No private photo assets are published. Confirm dimensions, openings and access-space layout before purchasing furniture or relying on clearances.

## Timeline

- 1 Nov 2026, 15:14 IST: Replaced photo estimates with supplied dimensions and the approved corrections; documented inferences, saved-data separation, validation and rollback.
- 2026-10-26: Created the first photo-guided approximation before dimensions were available.
