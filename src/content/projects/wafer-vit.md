---
title: Wafer-defect classification with Vision Transformers
summary: Fine-tuned ViT-Base/16 to classify 9 wafer-map defect patterns from only 631 labeled training images.
area: computer-vision
tags: [swe-ai]
kind: Research paper · solo
role: Solo project
team: Solo · course research paper
stack: [ViT-Base/16 (ImageNet-21k), Transfer learning, Focal Loss, AdamW, WM-811K]
highlights:
  - { value: '87.7%', label: 'test accuracy' }
  - { value: '0.876', label: 'macro F1' }
  - { value: '631', label: 'training images' }
links:
  - { label: 'Read the paper (PDF)', href: '/papers/vit-wafer-defect-inspection.pdf' }
cover: ../../assets/vit/wafer-classes.png
coverAlt: 'Nine example wafer maps, one per defect class: None, Edge-Ring, Edge-Local, Center, Local, Scratch, Random, Donut and Near-Full.'
order: 2
---

## Problem

Defective wafers cost semiconductor manufacturers a large share of their yield. Automated inspection systems built on CNNs reach high accuracy, but they need large labeled datasets for every defect type, and new defect types keep appearing. Their local convolutions also struggle with patterns that span the whole wafer, like a ring around the edge or a donut shape.

I wanted to know whether a Vision Transformer, pre-trained on natural images, could reach useful accuracy with only a few hundred labeled examples.

The inputs are wafer maps: die-level pass/fail maps of a whole wafer. The task is to classify which pattern a map shows, not to locate individual defects.

![Nine example wafer maps, one per class. None: scattered failing dies. Edge-Ring: a ring of failures around the rim. Edge-Local: a cluster on one edge. Center: a cluster in the middle. Local: a cluster away from the center. Scratch: a thin curved line. Random: failures spread everywhere. Donut: a ring with a clear center. Near-Full: almost the whole wafer failing.](../../assets/vit/wafer-classes.png)

*The 9 defect classes in WM-811K, one example each.*

## Approach

### Data

I used a balanced 902-image subset of the WM-811K benchmark across 9 classes, with a stratified 70/15/15 split. That left 631 images for training, about 100 per class before the split, deliberately small to model a fab with few labeled examples.

### Model

ViT-Base/16, pre-trained on ImageNet-21k: 12 Transformer layers, 768-dimensional representations, 12 attention heads and 86M parameters. Each 224×224 map becomes 196 patches of 16×16 pixels, and every patch attends to every other patch. That gives the model global context from the first layer, which suits patterns like Edge-Ring and Donut.

### Two-stage fine-tuning

To stabilize the jump from natural photos to abstract wafer maps, I split fine-tuning into two stages:

1. **Head stabilization.** Freeze the backbone and train only the classifier head (learning rate 5×10⁻⁵).
2. **Full fine-tuning.** Unfreeze everything with differential learning rates: 5×10⁻⁶ for the embeddings, 2.5×10⁻⁵ for the encoder and 5×10⁻⁵ for the classifier.

Focal Loss and weighted sampling pushed the model to focus on the classes it found hardest. I used AdamW (weight decay 0.05, since the dataset is small), cosine annealing and gradient clipping at a max norm of 1.0. Training took about 3 hours on a CPU.

## Results

The final model reached **87.68% test accuracy** and **0.876 macro F1**, compared with a baseline ViT trained with standard cross-entropy loss and uniform sampling.

<div class="table-scroll" role="region" aria-label="Overall results" tabindex="0">
<table>
  <caption>Overall results on the test set</caption>
  <thead><tr><th scope="col">Metric</th><th scope="col">Baseline ViT</th><th scope="col">My approach</th><th scope="col">Change</th></tr></thead>
  <tbody>
    <tr><th scope="row">Accuracy</th><td>83.82%</td><td>87.68%</td><td>+3.86 pts</td></tr>
    <tr><th scope="row">Macro F1</th><td>0.835</td><td>0.876</td><td>+0.041</td></tr>
    <tr><th scope="row">Local F1 (hardest class)</th><td>0.690</td><td>0.786</td><td>+0.096</td></tr>
  </tbody>
</table>
</div>

The biggest gains came on the classes the baseline handled worst: Edge-Local, Scratch and Local. Three already-strong classes dipped slightly, a trade-off that still left macro F1 higher overall.

<div class="table-scroll" role="region" aria-label="Per-class results" tabindex="0">
<table>
  <caption>Per-class results (F1 change compared with the baseline)</caption>
  <thead><tr><th scope="col">Class</th><th scope="col">Precision</th><th scope="col">Recall</th><th scope="col">F1</th><th scope="col">Baseline F1</th><th scope="col">Change</th></tr></thead>
  <tbody>
    <tr><th scope="row">Center</th><td>0.867</td><td>0.867</td><td>0.867</td><td>0.867</td><td>0.000</td></tr>
    <tr><th scope="row">Donut</th><td>0.824</td><td>0.875</td><td>0.848</td><td>0.882</td><td>−0.034</td></tr>
    <tr><th scope="row">Edge-Local</th><td>0.923</td><td>0.750</td><td>0.828</td><td>0.640</td><td>+0.188</td></tr>
    <tr><th scope="row">Edge-Ring</th><td>0.882</td><td>0.938</td><td>0.909</td><td>0.821</td><td>+0.089</td></tr>
    <tr><th scope="row">Local</th><td>0.846</td><td>0.733</td><td>0.786</td><td>0.690</td><td>+0.096</td></tr>
    <tr><th scope="row">Scratch</th><td>0.867</td><td>0.867</td><td>0.867</td><td>0.759</td><td>+0.108</td></tr>
    <tr><th scope="row">Near-Full</th><td>1.000</td><td>0.933</td><td>0.966</td><td>0.966</td><td>0.000</td></tr>
    <tr><th scope="row">None</th><td>0.882</td><td>1.000</td><td>0.938</td><td>1.000</td><td>−0.062</td></tr>
    <tr><th scope="row">Random</th><td>0.824</td><td>0.933</td><td>0.875</td><td>0.889</td><td>−0.014</td></tr>
  </tbody>
</table>
</div>

### Where it still gets confused

Most errors fall between classes that look alike: Local maps were sometimes read as Scratch, and a few Edge-Local maps were read as None.

<div class="table-scroll" role="region" aria-label="Confusion matrix" tabindex="0">
<table class="matrix">
  <caption>Confusion matrix on the test set. Rows are the true class, columns the predicted class; the diagonal (bold) counts correct predictions.</caption>
  <thead><tr><th scope="col">True ↓ / Predicted →</th><th scope="col">Center</th><th scope="col">Donut</th><th scope="col">Edge-Local</th><th scope="col">Edge-Ring</th><th scope="col">Local</th><th scope="col">Scratch</th><th scope="col">Near-Full</th><th scope="col">None</th><th scope="col">Random</th></tr></thead>
  <tbody>
    <tr><th scope="row">Center</th><td class="hit">13</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><th scope="row">Donut</th><td>0</td><td class="hit">14</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
    <tr><th scope="row">Edge-Local</th><td>1</td><td>0</td><td class="hit">12</td><td>1</td><td>0</td><td>0</td><td>0</td><td>2</td><td>0</td></tr>
    <tr><th scope="row">Edge-Ring</th><td>1</td><td>0</td><td>0</td><td class="hit">15</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><th scope="row">Local</th><td>0</td><td>1</td><td>0</td><td>0</td><td class="hit">11</td><td>2</td><td>0</td><td>0</td><td>1</td></tr>
    <tr><th scope="row">Scratch</th><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td class="hit">13</td><td>0</td><td>0</td><td>1</td></tr>
    <tr><th scope="row">Near-Full</th><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td class="hit">14</td><td>0</td><td>0</td></tr>
    <tr><th scope="row">None</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td class="hit">15</td><td>0</td></tr>
    <tr><th scope="row">Random</th><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td class="hit">14</td></tr>
  </tbody>
</table>
</div>

### Training

![Four training plots. Loss falls steeply after the backbone is unfrozen and then levels off, with validation loss tracking training loss. Training and validation accuracy rise together and plateau. The learning-rate plot shows the cosine-annealing restarts. Validation accuracy climbs sharply after unfreezing and stays above the baseline.](../../assets/vit/training-curves.png)

*Training dynamics. Accuracy jumps once the backbone is unfrozen, validation tracks training closely without overfitting, and the learning-rate panel shows the cosine-annealing restarts.*

### In context

CNNs report around 95.5% accuracy when trained on the full WM-811K dataset. My model gives up some of that accuracy in exchange for an estimated 90% less labeled data, which is the trade-off a fab with a small defect library actually faces.

## What I’d do next

The natural next step is to build the ViT into an anomaly-detection framework, so the system can flag defect patterns it has never seen instead of forcing them into a known class.
