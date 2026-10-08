import json
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split

ARTIFACTS_DIR = Path(__file__).resolve().parent / "artifacts"
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

MODEL_FILE = ARTIFACTS_DIR / "attrition_model.joblib"
METRICS_FILE = ARTIFACTS_DIR / "model_metrics.json"

FEATURE_NAMES = [
    "satisfaction_score",        # 0 - 100
    "engagement_score",          # 0 - 100
    "monthly_hours",             # 140 - 240
    "overtime_hours",            # 0 - 50
    "compa_ratio",               # 0.70 - 1.30 (salary / benchmark)
    "years_since_last_promotion",# 0 - 8
    "tenure_years",              # 0.5 - 12
    "project_count",             # 1 - 7
    "manager_rating",            # 1.0 - 5.0
    "performance_score",         # 1.0 - 5.0
    "salary_growth_rate",        # 0.0 - 15.0 %
]

FEATURE_LABELS = {
    "satisfaction_score": "Job Satisfaction",
    "engagement_score": "Workforce Engagement",
    "monthly_hours": "Monthly Workload",
    "overtime_hours": "Overtime Volume",
    "compa_ratio": "Compensation Competitiveness",
    "years_since_last_promotion": "Career Progression Stagnation",
    "tenure_years": "Organizational Tenure",
    "project_count": "Active Project Load",
    "manager_rating": "Manager Relationship Quality",
    "performance_score": "Performance Rating",
    "salary_growth_rate": "Salary Growth Rate",
}


def generate_synthetic_dataset(n_samples: int = 3000, random_seed: int = 42) -> pd.DataFrame:
    """
    Generate realistic enterprise workforce data based on proven empirical
    attrition dynamics (low engagement, compensation stagnation, overtime burnout,
    and lack of career advancement).
    """
    np.random.seed(random_seed)

    # Core workforce distributions
    satisfaction = np.random.normal(loc=68, scale=18, size=n_samples)
    satisfaction = np.clip(satisfaction, 10, 100)

    engagement = np.random.normal(loc=70, scale=16, size=n_samples)
    engagement = np.clip(engagement, 10, 100)

    monthly_hours = np.random.normal(loc=172, scale=20, size=n_samples)
    monthly_hours = np.clip(monthly_hours, 130, 250)

    overtime_hours = np.random.exponential(scale=10, size=n_samples)
    overtime_hours = np.clip(overtime_hours, 0, 55)

    compa_ratio = np.random.normal(loc=0.98, scale=0.14, size=n_samples)
    compa_ratio = np.clip(compa_ratio, 0.65, 1.45)

    tenure_years = np.random.exponential(scale=3.5, size=n_samples) + 0.5
    tenure_years = np.clip(tenure_years, 0.5, 15.0)

    years_since_promo = np.random.uniform(0, 1, size=n_samples) * np.minimum(tenure_years, 6.0)

    project_count = np.random.choice([1, 2, 3, 4, 5, 6], size=n_samples, p=[0.1, 0.35, 0.30, 0.15, 0.07, 0.03])

    manager_rating = np.random.normal(loc=3.8, scale=0.8, size=n_samples)
    manager_rating = np.clip(manager_rating, 1.0, 5.0)

    performance_score = np.random.normal(loc=3.5, scale=0.7, size=n_samples)
    performance_score = np.clip(performance_score, 1.0, 5.0)

    salary_growth = np.random.normal(loc=4.5, scale=3.0, size=n_samples)
    salary_growth = np.clip(salary_growth, 0.0, 18.0)

    # Calculate empirical latent attrition probability (realistic enterprise logit)
    # 1. Satisfaction & Engagement deficit
    z_sat = (65 - satisfaction) / 18.0
    z_eng = (65 - engagement) / 18.0

    # 2. Burnout (hours > 190 and overtime > 18)
    z_burnout = ((monthly_hours - 170) / 25.0) + ((overtime_hours - 10) / 15.0)

    # 3. Compensation gap (compa_ratio < 0.92, low growth)
    z_comp = (1.0 - compa_ratio) * 3.5 + (4.0 - salary_growth) / 4.0

    # 4. Career stagnation (high performers unpromoted for > 2.5 years)
    z_promo = (years_since_promo - 1.8) * 0.45 * (performance_score / 3.0)

    # 5. Manager friction
    z_mgr = (3.5 - manager_rating) * 0.55

    logit = -2.1 + 0.85 * z_sat + 0.75 * z_eng + 0.60 * z_burnout + 0.55 * z_comp + 0.45 * z_promo + 0.40 * z_mgr
    # Add mild realistic stochastic noise
    noise = np.random.normal(0, 0.35, size=n_samples)
    prob = 1.0 / (1.0 + np.exp(-(logit + noise)))

    attrition = (prob > 0.48).astype(int)

    df = pd.DataFrame({
        "satisfaction_score": satisfaction,
        "engagement_score": engagement,
        "monthly_hours": monthly_hours,
        "overtime_hours": overtime_hours,
        "compa_ratio": compa_ratio,
        "years_since_last_promotion": years_since_promo,
        "tenure_years": tenure_years,
        "project_count": project_count,
        "manager_rating": manager_rating,
        "performance_score": performance_score,
        "salary_growth_rate": salary_growth,
        "attrition": attrition,
        "true_prob": prob,
    })
    return df


def train_and_evaluate_model() -> dict:
    print("Generating synthetic enterprise workforce training dataset...")
    df = generate_synthetic_dataset(n_samples=3500, random_seed=42)

    X = df[FEATURE_NAMES]
    y = df["attrition"]

    attrition_rate = float(y.mean())
    print(f"Dataset samples: {len(df)} | Baseline Attrition Rate: {attrition_rate:.1%}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print("Training RandomForestClassifier model...")
    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=9,
        min_samples_split=8,
        min_samples_leaf=4,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    # Evaluation on Holdout Test Set
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    y_pred = (y_pred_proba >= 0.50).astype(int)

    auc = float(roc_auc_score(y_test, y_pred_proba))
    precision = float(precision_score(y_test, y_pred))
    recall = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    acc = float(accuracy_score(y_test, y_pred))
    cm = confusion_matrix(y_test, y_pred).tolist()

    # 5-Fold Stratified Cross Validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X, y, cv=cv, scoring="roc_auc")
    cv_mean = float(cv_scores.mean())
    cv_std = float(cv_scores.std())

    # Feature Importances
    importances = model.feature_importances_
    feat_imp = [
        {
            "feature": feat,
            "label": FEATURE_LABELS[feat],
            "importance": round(float(imp), 4),
        }
        for feat, imp in sorted(
            zip(FEATURE_NAMES, importances, strict=False),
            key=lambda x: x[1],
            reverse=True,
        )
    ]

    metrics = {
        "model_type": "RandomForestClassifier",
        "model_version": "rf_v2.1.0_strata",
        "dataset_size": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "baseline_attrition_rate": round(attrition_rate, 4),
        "roc_auc": round(auc, 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1, 4),
        "accuracy": round(acc, 4),
        "cv_roc_auc_mean": round(cv_mean, 4),
        "cv_roc_auc_std": round(cv_std, 4),
        "confusion_matrix": {
            "true_negatives": cm[0][0],
            "false_positives": cm[0][1],
            "false_negatives": cm[1][0],
            "true_positives": cm[1][1],
        },
        "feature_importances": feat_imp,
        "feature_means": {f: round(float(df[f].mean()), 4) for f in FEATURE_NAMES},
    }

    # Save artifacts
    print(f"Saving model to {MODEL_FILE}...")
    joblib.dump(model, MODEL_FILE)

    print(f"Saving metrics to {METRICS_FILE}...")
    with open(METRICS_FILE, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"--- MODEL EVALUATION SUMMARY ---")
    print(f"ROC-AUC:   {auc:.4f} (5-fold CV: {cv_mean:.4f} ± {cv_std:.4f})")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    print(f"Accuracy:  {acc:.4f}")
    print(f"Top 3 Features: {feat_imp[0]['label']}, {feat_imp[1]['label']}, {feat_imp[2]['label']}")
    return metrics


if __name__ == "__main__":
    train_and_evaluate_model()
