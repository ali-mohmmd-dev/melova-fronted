"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function AdminAddProduct() {
  const [variants, setVariants] = useState([
    { id: 0, name: "", gram: "", price: "", isPrimary: true, images: [""] },
  ]);

  const addVariant = () => {
    const newId =
      variants.length > 0 ? Math.max(...variants.map((v) => v.id)) + 1 : 0;
    setVariants([
      ...variants,
      {
        id: newId,
        name: "",
        gram: "",
        price: "",
        isPrimary: false,
        images: [""],
      },
    ]);
  };

  const removeVariant = (id) => {
    // If we're deleting the primary, make the first remaining variant primary
    const filtered = variants.filter((v) => v.id !== id);
    if (filtered.length > 0 && variants.find((v) => v.id === id)?.isPrimary) {
      filtered[0].isPrimary = true;
    }
    setVariants(filtered);
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(
      variants.map((v) => {
        if (v.id === id) {
          if (field === "isPrimary" && value === true) {
            return { ...v, isPrimary: true };
          }
          return { ...v, [field]: value };
        }
        // If we are setting a new primary, unset the others
        if (field === "isPrimary" && value === true) {
          return { ...v, isPrimary: false };
        }
        return v;
      }),
    );
  };

  const addImageToVariant = (variantId) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId ? { ...v, images: [...v.images, ""] } : v,
      ),
    );
  };

  const removeImageFromVariant = (variantId, imageIndex) => {
    setVariants(
      variants.map((v) => {
        if (v.id === variantId) {
          const newImages = [...v.images];
          newImages.splice(imageIndex, 1);
          return { ...v, images: newImages };
        }
        return v;
      }),
    );
  };

  const updateImage = (variantId, imageIndex, value) => {
    setVariants(
      variants.map((v) => {
        if (v.id === variantId) {
          const newImages = [...v.images];
          newImages[imageIndex] = value;
          return { ...v, images: newImages };
        }
        return v;
      }),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      "Frontend Mock: Product details, variants, and multiple images captured!\n\nThis would normally POST to the Django API.",
    );
    window.location.href = "/admin/products";
  };

  return (
    <div className="admin-content">
      <style>{`
        .variant-row {
            background: rgba(86, 44, 27, 0.02);
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 2rem;
            position: relative;
            border: 1px solid var(--glass-border);
            transition: all 0.3s ease;
        }
        .variant-row:hover {
            background: white;
            box-shadow: 0 10px 30px rgba(86, 44, 27, 0.05);
            border-color: var(--admin-secondary);
        }
        .remove-variant {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            color: #dc3545;
            cursor: pointer;
            z-index: 5;
            font-size: 1.25rem;
            opacity: 0.6;
            transition: opacity 0.3s ease;
        }
        .remove-variant:hover {
            opacity: 1;
        }
        .variant-images-section {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px dashed var(--glass-border);
        }
        .variant-image-input-group {
            display: flex;
            gap: 15px;
            margin-bottom: 1rem;
            align-items: center;
        }
        .variant-image-preview {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid var(--glass-border);
            background: #fff;
        }
        .form-label {
            font-weight: 600;
            color: var(--admin-primary);
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
            letter-spacing: 0.3px;
        }
        .form-control {
            padding: 0.75rem 1rem;
            border-radius: 10px;
            border: 1px solid var(--glass-border);
            background: white;
        }
        .form-control:focus {
            border-color: var(--admin-secondary);
            box-shadow: 0 0 0 4px rgba(158, 124, 41, 0.1);
        }
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .section-header h2 {
            font-family: 'Story Script', cursive;
            font-size: 2.5rem;
            color: var(--admin-primary);
            margin: 0;
        }
        .breadcrumb {
          display: flex;
          list-style: none;
          padding: 0;
          margin-bottom: 1rem;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--admin-text-muted);
        }
        .breadcrumb a {
          color: var(--admin-text-muted);
          text-decoration: none;
        }
        .breadcrumb .active {
          color: var(--admin-primary);
          font-weight: 600;
        }
      `}</style>

      {/* Breadcrumb & Title */}
      <div className="mb-5">
        <ul className="breadcrumb">
          <li><Link href="/admin">Dashboard</Link></li>
          <li>/</li>
          <li><Link href="/admin/products">Products</Link></li>
          <li>/</li>
          <li className="active">Add New Product</li>
        </ul>
        <div className="section-header">
          <h2>Create New Creation</h2>
          <Link href="/admin/products" className="btn btn-outline-secondary">
            <i className="fas fa-arrow-left me-2"></i> Back to List
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center g-5">
          <div className="col-lg-12">
            {/* Product Info */}
            <div className="admin-card mb-5">
              <div className="card-header">
                <h2>General Information</h2>
              </div>
              <div className="card-body p-4 p-md-5">
                <div className="row g-4">
                  <div className="col-md-8">
                    <div className="mb-4">
                      <label htmlFor="productName" className="form-label">
                        Product Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productName"
                        name="name"
                        placeholder="e.g. Belgian Dark Chocolate Bar"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-4">
                      <label htmlFor="basePrice" className="form-label">
                        Entry Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="basePrice"
                        name="price"
                        placeholder="0.00"
                        required
                      />
                      <div className="form-text small opacity-75">Visible as 'Starting from' price</div>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="productIntro" className="form-label">
                    Teaser Introduction
                  </label>
                  <textarea
                    className="form-control"
                    id="productIntro"
                    name="intro"
                    rows="2"
                    placeholder="A enticing one-liner about your chocolate treat..."
                    required
                  ></textarea>
                </div>
                <div className="mb-0">
                  <label htmlFor="productDescription" className="form-label">
                    Detailed Story
                  </label>
                  <textarea
                    className="form-control"
                    id="productDescription"
                    name="description"
                    rows="6"
                    placeholder="Describe the notes, origin, and craftsmanship involved..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Variants Section */}
            <div className="admin-card mb-5">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h2>Product Variations</h2>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={addVariant}
                >
                  <i className="fas fa-plus me-2"></i> Add Size/Variant
                </button>
              </div>
              <div className="card-body p-4 p-md-5">
                {variants.map((variant, index) => (
                  <div className="variant-row" key={variant.id}>
                    {variants.length > 1 && (
                      <span
                        className="remove-variant"
                        onClick={() => removeVariant(variant.id)}
                        title="Remove Variant"
                      >
                        <i className="fas fa-times-circle"></i>
                      </span>
                    )}

                    <div className="row g-4">
                      <div className="col-md-4">
                        <label className="form-label">Variant Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Large Box (12 pcs)"
                          required
                          value={variant.name}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "name",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Weight (g)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="500"
                          required
                          value={variant.gram}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "gram",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Weight Price (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="250"
                          required
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "price",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label d-block text-center mb-3">Default?</label>
                        <div className="d-flex justify-content-center">
                          <div className="form-check form-switch p-0 m-0">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="primary_variant"
                              style={{ width: '2.5em', height: '1.25em', float: 'none', cursor: 'pointer' }}
                              checked={variant.isPrimary}
                              onChange={() =>
                                handleVariantChange(variant.id, "isPrimary", true)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Variant Images */}
                    <div className="variant-images-section">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0 small fw-bold text-uppercase letter-spacing-1">Variant Gallery</h5>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => addImageToVariant(variant.id)}
                        >
                          <i className="fas fa-plus me-1"></i> Add URL
                        </button>
                      </div>

                      <div className="row g-3">
                        {variant.images.map((imgUrl, imgIndex) => (
                          <div className="col-lg-6" key={imgIndex}>
                            <div className="variant-image-input-group">
                              <img
                                src={imgUrl || '/img/placeholder.png'}
                                className="variant-image-preview"
                                alt="Preview"
                                onError={(e) => (e.target.src = "https://placehold.co/100x100?text=No+Image")}
                              />
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Image URL (e.g. /img/dark-choc.jpg)"
                                value={imgUrl}
                                onChange={(e) =>
                                  updateImage(variant.id, imgIndex, e.target.value)
                                }
                              />
                              {variant.images.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-sm text-danger p-2"
                                  onClick={() =>
                                    removeImageFromVariant(variant.id, imgIndex)
                                  }
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex justify-content-between align-items-center mt-5 mb-5 p-4 bg-white rounded-3 shadow-sm border">
               <span className="text-muted small italic">Ready to add this masterpiece to your collection?</span>
               <div className="d-flex gap-3">
                  <Link
                    href="/admin/products"
                    className="btn btn-outline-secondary px-4"
                  >
                    Discard Changes
                  </Link>
                  <button type="submit" className="btn btn-primary px-5 py-3">
                    <i className="fas fa-check-circle me-2"></i> Publish Product
                  </button>
               </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
