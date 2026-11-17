/**
 * ============================================================================
 * MITHILA GAMES // SHOP & TOOLS DATA REPOSITORY (shopData.js)
 * ============================================================================
 * Central repository for store loadouts: addons, tools, 3D models, assets,
 * shaders, and merchandise.
 *
 * ----------------------------------------------------------------------------
 * ITEM SCHEMA SPECIFICATION & FIELD GUIDE:
 * ----------------------------------------------------------------------------
 * Each object in `window.SHOP_DATA` supports the following properties:
 *
 * - id (string, required):
 *     Unique slug for the item (e.g., "lowpoly-character", "haircards").
 *     Used for DOM tracking, modal deep linking via `?item={id}`, and sharing.
 *
 * - title (string, required):
 *     Display name of the product (e.g., "Lowpoly Character").
 *
 * - category (string, required):
 *     Filter category key used by the store tabs:
 *       • "3d" (or "assets", "3D kits") -> 3D & ASSETS tab
 *       • "tools"                       -> DEV TOOLS & ADDONS tab
 *       • "merch"                       -> MERCH & MEDIA tab
 *
 * - categoryLabel (string, required):
 *     Human-readable category badge shown on cards & modal (e.g., "3D Models", "Blender addons").
 *
 * - price (string, required):
 *     Price display tag (e.g., "FREE", "$15", "NAME YOUR PRICE").
 *     Items containing "FREE" receive the lime sticker badge automatically.
 *
 * - image (string, required):
 *     Path to primary thumbnail / banner image (e.g., "content/3D_models/.../thumbnail.png").
 *
 * - images (array of strings, optional):
 *     Array of image paths for the modal multi-image gallery & zoom viewer.
 *     If omitted or empty, falls back to `[image]`.
 *
 * - badge (string, optional):
 *     HUD corner sticker text on the thumbnail (e.g., "3D Model", "Addon", "Rigged").
 *
 * - shortDesc (string, required):
 *     Concise 1-2 sentence description displayed on store catalog cards.
 *
 * - fullDesc (string, required):
 *     Detailed summary shown inside the product detail modal.
 *
 * - specs (array of objects, optional):
 *     Key-value technical specifications displayed in the modal:
 *     [
 *       { label: "FORMAT", value: ".blend, .fbx, .obj" },
 *       { label: "RIGGED", value: "Yes" },
 *       { label: "INCLUDES", value: "Mesh, Textures, Demo Scene" }
 *     ]
 *
 * - downloadText (string, optional):
 *     Label on the primary action button (e.g., "Download [Free]", "Buy [Free]").
 *     Defaults to "DOWNLOAD PRODUCT".
 *
 * - downloadUrl (string, required):
 *     Target URL to download or purchase page (e.g., itch.io, GitHub, Gumroad).
 * ============================================================================
 */

window.SHOP_DATA = [
  {
    id: "haircards",
    title: "Haircards [early dev]",
    category: "tools",
    categoryLabel: "Blender addons",
    price: "FREE",
    image: "content/Haircards/banner.png",
    images: [
      "content/Haircards/banner.png",
      "content/Haircards/image1.png",
      "content/Haircards/image2.png"
    ],
    badge: "Addon",
    shortDesc: "It converts the blender particles to card mesh.",
    fullDesc: "convers the blender particles to mesh cards , it is designed to be used in hairs.",
    specs: [
      { label: "LANGUAGE LAYER", value: "Python" },
      { label: "COMPATIBILITY", value: "Blender x.x" },  
      { label: "INCLUDES", value: "Demo project, Documentation, Addon" }
    ],
    downloadText: "Buy [Free]",
    downloadUrl: "https://mithilagames.itch.io/haircards-blender-particle-hair-to-cards"
  },

  {
    id: "lowpoly-character",
    title: "Lowpoly Character",
    category: "3d",
    categoryLabel: "3D Models",
    price: "FREE",
    image: "content/3D_models/lowpoly-characters/thumbnail.png",
    images: [
      "content/3D_models/lowpoly-characters/thumbnail.png"
    ],
    badge: "3D Model",
    shortDesc: "A versatile, rigged low-poly character model ready for game engines.",
    fullDesc: "A fully rigged and animated low-poly character model suitable for prototyping, indie games, and mobile projects. Includes base animations and a standard humanoid rig.",
    specs: [
      { label: "FORMAT", value: ".blend, .fbx, .obj" },
      { label: "RIGGED", value: "Yes" },  
      { label: "INCLUDES", value: "3D Model, Textures, Demo Scene" }
    ],
    downloadText: "Buy [Free]",
    downloadUrl: "https://mithilagames.itch.io/lowpoly-character"
  },

  {
    id: "VertShade",
    title: "VertShade",
    category: "tools",
    categoryLabel: "Blender addons",
    price: "FREE",
    image: "content/Vertex-Shadow-Painter-for-Blender/banner.png",
    images: [
      "content/Vertex-Shadow-Painter-for-Blender/banner.png",
      "content/Vertex-Shadow-Painter-for-Blender/img4.png",
      "content/Vertex-Shadow-Painter-for-Blender/img3.png",
      "content/Vertex-Shadow-Painter-for-Blender/img1.png",
      "content/Vertex-Shadow-Painter-for-Blender/img2.png"
    ],
    badge: "Addon",
    shortDesc: "It helps to add shadows/AO baked on to mesh with vertex colour",
    fullDesc: "This addon helps in baking shadown and AO on to meshes directly with vertex colour. this gives full conttroll of the shadows and AO in the hand of the artist , the main use of this in games. ",
    specs: [
      { label: "LANGUAGE LAYER", value: "Python" },
      { label: "COMPATIBILITY", value: "Blender x.x" },  
      { label: "INCLUDES", value: "Demo project, Documentation, Addon" }
    ],
    downloadText: "Download [Free]",
    downloadUrl: "https://mithilagames.itch.io/vertshade"
  } 
];