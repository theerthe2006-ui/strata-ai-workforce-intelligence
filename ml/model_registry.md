# ML Model Registry

## Attrition Model

Model family: RandomForestClassifier / XGBoost candidate.

### Pipeline

1. Load structured HR dataset.
2. Build feature matrix from department, tenure, salary, performance, skill coverage, compensation, manager relationship, engagement, and promotion history.
3. Train baseline RandomForestClassifier.
4. Evaluate precision, recall, F1, ROC-AUC, confusion matrix, and feature importance.
5. Persist a model artifact with semantic version and evaluation metrics.

## Feature Engineering

- Employment status
- Average compensation ratio
- Years of experience
- Promotion count
- Manager tenure
- Skill gap severity
- Performance trend
- Attendance anomalies

## Production Controls

- Model versioning
- Drift monitoring hooks
- SHAP explainability service integration
- Model registry metadata persistence
