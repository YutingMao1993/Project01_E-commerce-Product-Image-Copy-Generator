import { useEffect, useState } from "react";
import type { AssetLibraryItem } from "../types";

interface AssetsPageProps {
  assets: AssetLibraryItem[];
  onUseAsset: (asset: AssetLibraryItem) => void;
}

export function AssetsPage({ assets, onUseAsset }: AssetsPageProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id ?? "");
  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId) ?? assets[0] ?? null;

  useEffect(() => {
    if (!assets.length) {
      setSelectedAssetId("");
      return;
    }

    if (!assets.some((asset) => asset.id === selectedAssetId)) {
      setSelectedAssetId(assets[0].id);
    }
  }, [assets, selectedAssetId]);

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
        <div className="library-layout">
          <article className="panel library-list-panel">
            <div className="library-list-header">
              <div>
                <p className="eyebrow">Asset Library</p>
                <h3>{assets.length} saved assets</h3>
              </div>
              <p className="library-meta">Select an asset to inspect metadata and reuse it in Generate.</p>
            </div>

            <div className="library-list">
              {assets.map((asset) => {
                const isActive = asset.id === selectedAsset?.id;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    className={`library-list-item ${isActive ? "library-list-item-active" : ""}`}
                    onClick={() => setSelectedAssetId(asset.id)}
                  >
                    <div className="library-list-item-top">
                      <strong>{asset.productName}</strong>
                      <span className="library-meta">{asset.savedAt}</span>
                    </div>
                    <small>{asset.brand} · {asset.category}</small>
                    <span className="library-meta">{asset.store}</span>
                  </button>
                );
              })}
            </div>
          </article>

          {selectedAsset ? (
            <article className="panel asset-detail-panel">
              <img src={selectedAsset.imageUrl} alt={selectedAsset.productName} className="asset-card-image" />
              <div className="asset-card-body">
                <h3>{selectedAsset.productName}</h3>
                <p className="library-meta">{selectedAsset.brand} · {selectedAsset.category}</p>
                <p className="library-meta">{selectedAsset.store} · Saved {selectedAsset.savedAt}</p>
                <div className="tag-row">
                  {selectedAsset.references.map((reference) => (
                    <span key={reference} className="tag-pill">{reference}</span>
                  ))}
                </div>
                <div className="button-row">
                  <button type="button" className="button button-primary" onClick={() => onUseAsset(selectedAsset)}>
                    Use Asset
                  </button>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      )}
    </section>
  );
}
