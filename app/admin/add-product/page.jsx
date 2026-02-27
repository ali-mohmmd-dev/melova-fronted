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
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            position: relative;
            border: 1px solid #dee2e6;
        }
        .remove-variant {
            position: absolute;
            top: 10px;
            right: 10px;
            color: #dc3545;
            cursor: pointer;
            z-index: 5;
        }
        .variant-images-section {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px dashed #ccc;
        }
        .variant-image-input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 0.5rem;
            align-items: center;
        }
        .variant-image-preview {
            width: 40px;
            height: 40px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center g-4">
          <div className="col-lg-10">
            {/* Product Info */}
            <div className="admin-card mb-4">
              <div className="card-header">
                <h2>Product Information</h2>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="productName" className="form-label">
                        Product Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productName"
                        name="name"
                        placeholder="e.g. Pure Honey"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="basePrice" className="form-label">
                        Base Price (₹){" "}
                        <span className="text-muted small">
                          (Starting from)
                        </span>
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
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="productIntro" className="form-label">
                    Short Intro
                  </label>
                  <textarea
                    className="form-control"
                    id="productIntro"
                    name="intro"
                    rows="2"
                    placeholder="Brief summary of the product"
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="productDescription" className="form-label">
                    Full Description
                  </label>
                  <textarea
                    className="form-control"
                    id="productDescription"
                    name="description"
                    rows="6"
                    placeholder="Detailed product description"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Variants Section */}
            <div className="admin-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h2>Product Variants</h2>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={addVariant}
                >
                  <i className="fas fa-plus"></i> Add Variant
                </button>
              </div>
              <div className="card-body">
                {variants.map((variant, index) => (
                  <div className="variant-row" key={variant.id}>
                    {variants.length > 1 && (
                      <span
                        className="remove-variant"
                        onClick={() => removeVariant(variant.id)}
                      >
                        <i className="fas fa-times-circle"></i>
                      </span>
                    )}

                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">Variant Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 500g Bottle"
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
                        <label className="form-label">Weight (grams)</label>
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
                        <label className="form-label">Price (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="250.00"
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
                      <div className="col-md-2 d-flex align-items-end">
                        <div className="form-text text-muted mb-2">
                          Primary?
                        </div>
                        <div className="form-check form-switch mb-2 ms-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="primary_variant"
                            checked={variant.isPrimary}
                            onChange={() =>
                              handleVariantChange(variant.id, "isPrimary", true)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Variant Images */}
                    <div className="variant-images-section">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0 small fw-bold">Variant Images</h5>
                        <button
                          type="button"
                          className="btn btn-xs btn-outline-secondary py-0 px-2"
                          onClick={() => addImageToVariant(variant.id)}
                        >
                          <i className="fas fa-plus"></i> Add Image URL
                        </button>
                      </div>

                      {variant.images.map((imgUrl, imgIndex) => (
                        <div
                          className="variant-image-input-group"
                          key={imgIndex}
                        >
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              className="variant-image-preview"
                              alt="Preview"
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          ) : (
                            <div
                              className="variant-image-preview"
                              style={{ display: "none" }}
                            ></div>
                          )}
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Image URL (e.g. /img/product.jpg)"
                            value={imgUrl}
                            onChange={(e) =>
                              updateImage(variant.id, imgIndex, e.target.value)
                            }
                          />
                          {variant.images.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                removeImageFromVariant(variant.id, imgIndex)
                              }
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex justify-content-end gap-3 mt-4 mb-5">
              <Link
                href="/admin/products"
                className="btn btn-outline-secondary px-4 d-flex align-items-center"
              >
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary btn-lg px-5">
                <i className="fas fa-save me-2"></i> Save Product
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
