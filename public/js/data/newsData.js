/**
 * MITHILA GAMES // NEWS & UPDATES REPOSITORY
 * Studio devlogs, engine tooling updates, and major announcements
 */

window.NEWS_DATA = [
  {
      id: "news-blender-hair-cards-addon",
      title: "Introducing HairCards 3D: Automated Particle Hair to Card Mesh Converter",
      date: "2026-03-05",
      category: "BLENDER & PIPELINE",
      badge: "NEW RELEASE [Update]",
      image: "content/Haircards/banner.png",
      images: [
        "content/Haircards/banner.png",
        "content/Haircards/image1.png",
        "content/Haircards/image2.png"
      ],
      author: "Divyanshu Priyadarshi",
      readTime: "3 MIN READ",
      summary: "A custom Blender addon designed to automatically convert heavy particle hair systems into optimized, game-ready card meshes for real-time engines.",
      content: `
        <p class="mb-4">We are excited to release soon our custom Blender addon built to solve one of the most stubborn bottlenecks in real-time character pipelines: translating complex particle hair into low-poly, engine-friendly card meshes. This tool automates the tedious manual placement of hair cards while retaining the stylistic silhouette of your high-poly grooms.</p>
        
        <h4 class="font-syne font-bold text-white text-base mt-6 mb-2">Key Addon Features:</h4>
        <ul class="list-disc pl-5 space-y-2 text-slate-300 font-mono text-xs mb-4">
          <li><strong>Automated Clustering & Generation:</strong> Instantly groups particle strands into optimized strips based on density and flow vectors.</li>
          <li><strong>Smart UV:</strong> Automatically generates clean UV layouts from your hair curves.</li>
          <li><strong>One-Click Engine Export:</strong> Streamlines vertex color assignment and normal alignment for seamless integration into Godot, Unity, and Unreal Engine.</li>
        </ul>

        <p class="text-slate-muted">The addon will be avilable to use soon.</p>
      `
    }
 

];
