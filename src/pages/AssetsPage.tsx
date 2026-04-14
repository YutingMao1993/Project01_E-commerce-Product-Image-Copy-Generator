import type { AssetLibraryItem } from "../types";

interface AssetsPageProps {
  assets: AssetLibraryItem[];
  onUseAsset: (asset: AssetLibraryItem) => void;
}

export function AssetsPage({ assets, onUseAsset }: AssetsPageProps) {
  return (
    <section className="page-stack">
      <div className="page-intro">
        <p className="eyebrow">Library</p>
        <h3>Saved Product Assets</h3>
        <p className="panel-intro">Saved source materials from imported or manually entered products that can be reused in future generation flows.</p>
      </div>

      {assets.length === 0 ? (
        <article className="panel state-card">
          <div className="state-graphic state-graphic-empty" />
          <h3>No saved assets yet</h3>
          <p>Enable “Save product assets to library” on a product and generate a result to add it here.</p>
        </article>
      ) : (
        <div className="card-grid">
          {assets.map((asset) => (
            <article key={asset.id} className="panel asset-card">
              <img src={asset.imageUrl} alt={asset.productName} className="asset-card-image" />
              <div className="asset-card-body">
                <h4>{asset.productName}</h4>
                <p className="library-meta">{asset.brand} · {asset.category}</p>
                <p className="library-meta">{asset.store} · Saved {asset.savedAt}</p>
                <div className="tag-row">
                  {asset.references.map((reference) => (
                    <span key={reference} className="tag-pill">{reference}</span>
                  ))}
                </div>
                <div className="button-row">
                  <button type="button" className="button button-secondary" onClick={() => onUseAsset(asset)}>
                    Use Asset
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
