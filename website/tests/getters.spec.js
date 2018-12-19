/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import * as VuexStore from '../src/store/index'

describe('product getters', () => {
    describe('product id', () => {
        test('product id returns correct value',
            ensureGetProductIdReturnsCorrectValue
        );
    });
    describe('product dimensions', () => {
        test('product dimensions returns correct dimensions',
            ensureGetProductDimensionsReturnsCorrectValues
        );
    });
    describe('product slots', () => {
        test('product slot widths returns correct slot widths',
            ensureGetProductSlotWidthsReturnsCorrectValues
        );
        test('product recommended slot width returns correct value',
            ensureGetProductRecommendedSlotWidthReturnsCorrectValue
        );
        test('product maximum slot width returns correct value',
            ensureGetProductMaximumSlotWidthReturnsCorrectValue
        );
        test('product minimum slot width returns correct value',
            ensureGetProductMinimumSlotWidthReturnsCorrectValue
        );
    });
    describe('product materials', () => {
        test('product materials returns correct materials',
            ensureGetProductMaterialsReturnsCorrectValues
        );
    });
    describe('product components', () => {
        test('product components returns correct components',
            ensureGetProductComponentsReturnsCorrectValues
        );
    });
})

describe('customized product getters', () => {
    describe('customized product dimensions', () => {
        test('customized product dimensions returns correct values',
            ensureGetCustomizedProductDimensionsReturnsCorrectValues
        );
    });
    describe('customized product slots', () => {
        test('customized products slot width returns correct values',
            ensureGetCustomizedProductSlotWidthReturnsCorrectValues
        );
    });
    describe('customized product components', () => {
        test('customized products components returns correct values',
            ensureGetCustomizedProductComponentsReturnsCorrectValues
        );
    })
    describe('customized products customized material', () => {
        test('customized products customized material image returns correct value',
            ensureGetCustomizedProductCustomizedMaterialImageReturnsCorrectValue
        );
    })
})

describe('canvas controls getters', () => {
    describe('movement controls', () => {
        describe('closet movement controls', () => {
            test('can move closet returns correct value',
                ensureGetCanMoveClosetReturnsCorrectValue
            );
        });
        describe('slots movement controls', () => {
            test('can move slots returns correct value',
                ensureGetCanMoveSlotsReturnsCorrectValue
            );
        });
        describe('components movement controls', () => {
            test('can move components returns correct value',
                ensureGetCanMoveComponentsReturnsCorrectValue
            );
        });
    });
    describe('removal controls', () => {
        describe('component removal controls', () => {
            test('component to remove returns correct value',
                ensureGetComponentToRemoveReturnsCorrectValue
            );
        });
    });
})

function ensureGetProductIdReturnsCorrectValue() {
    const expectedId = 1;
    VuexStore.default.replaceState({
        product: {
            "id": expectedId
        }
    });
    const actualId = VuexStore.getters.productId(VuexStore.default.state);
    expect(actualId).toBe(expectedId);
}

function ensureGetProductDimensionsReturnsCorrectValues() {
    const expectedDimensions = [
        {
            "id": 5,
            "height": {
                "id": 14,
                "unit": "mm",
                "values": [
                    100,
                    140,
                ]
            },
            "width": {
                "id": 15,
                "unit": "mm",
                "value": 500
            },
            "depth": {
                "id": 13,
                "unit": "mm",
                "minValue": 15000,
                "maxValue": 20000,
                "increment": 250
            }
        }
    ]
    VuexStore.default.replaceState({
        product: {
            "dimensions": expectedDimensions
        }
    });
    const actualDimensions = VuexStore.getters.productDimensions(VuexStore.default.state);
    expect(actualDimensions).toBe(expectedDimensions);
}

function ensureGetProductSlotWidthsReturnsCorrectValues() {
    const expectedSlotWidths = {
        "minWidth": 200,
        "maxWidth": 500,
        "recommendedWidth": 250,
        "unit": "mm"
    };
    VuexStore.default.replaceState({
        product: {
            "slotWidths": expectedSlotWidths
        }
    });
    const actualSlotWidths = VuexStore.getters.productSlotWidths(VuexStore.default.state);
    expect(actualSlotWidths).toBe(expectedSlotWidths);
}

function ensureGetProductRecommendedSlotWidthReturnsCorrectValue() {
    const expectedRecommendedSlotWidth = 250;
    VuexStore.default.replaceState({
        product: {
            "slotWidths": {
                "recommendedWidth": 250
            }
        }
    });
    const actualRecommendedSlotWidth = VuexStore.getters.recommendedSlotWidth(VuexStore.default.state);
    expect(actualRecommendedSlotWidth).toBe(expectedRecommendedSlotWidth);
}

function ensureGetProductMaximumSlotWidthReturnsCorrectValue() {
    const expectedMaximumSlotWidth = 500;
    VuexStore.default.replaceState({
        product: {
            "slotWidths": {
                "maxWidth": 500
            }
        }
    });
    const actualMaximumSlotWidth = VuexStore.getters.maxSlotWidth(VuexStore.default.state);
    expect(actualMaximumSlotWidth).toBe(expectedMaximumSlotWidth);
}

function ensureGetProductMinimumSlotWidthReturnsCorrectValue() {
    const expectedMinimumSlotWidth = 200;
    VuexStore.default.replaceState({
        product: {
            "slotWidths": {
                "minWidth": 200
            }
        }
    });
    const actualMinimumSlotWidth = VuexStore.getters.minSlotWidth(VuexStore.default.state);
    expect(actualMinimumSlotWidth).toBe(expectedMinimumSlotWidth);
}

function ensureGetProductMaterialsReturnsCorrectValues() {
    const expectedMaterials = [
        {
            "id": 1,
            "reference": "#666",
            "designation": "Cherry Wood",
            "image": "cherry-wood.png"
        }
    ];
    VuexStore.default.replaceState({
        product: {
            "materials": expectedMaterials
        }
    });
    const actualMaterials = VuexStore.getters.productMaterials(VuexStore.default.state);
    expect(actualMaterials).toBe(expectedMaterials);
}

function ensureGetProductComponentsReturnsCorrectValues() {
    const expectedComponents = [
        {
            "id": 1,
            "reference": "1",
            "designation": "component1",
            "model": "component1.glb",
            "mandatory": true
        },
        {
            "id": 2,
            "reference": "2",
            "designation": "component2",
            "model": "component2.glb",
            "mandatory": false
        }
    ];
    VuexStore.default.replaceState({
        product: {
            "components": expectedComponents
        }
    });
    const actualComponents = VuexStore.getters.productComponents(VuexStore.default.state);
    expect(actualComponents).toBe(expectedComponents);
}

function ensureGetCustomizedProductDimensionsReturnsCorrectValues() {
    const expectedDimensions = {
        dimensions: {
            height: 200,
            width: 200,
            depth: 200,
            unit: "cm"
        }
    };
    VuexStore.default.replaceState({
        customizedProduct: {
            customizedDimensions: expectedDimensions
        }
    });
    const actualDimensions = VuexStore.getters.customizedProductDimensions(VuexStore.default.state);
    expect(actualDimensions).toBe(expectedDimensions);
}

function ensureGetCustomizedProductSlotWidthReturnsCorrectValues() {
    const expectedFirstSlotWidth = 100;
    const expectedSlots =
        [
            {
                width: expectedFirstSlotWidth
            }
        ];
    VuexStore.default.replaceState({
        customizedProduct: {
            slots: expectedSlots
        }
    });
    //console.log(VuexStore.default.state.customizedProduct.slots);
    const actualFirstSlotWidth = VuexStore.getters.customizedProductSlotWidth(VuexStore.default.state)(0).width;
    expect(actualFirstSlotWidth).toBe(expectedFirstSlotWidth);
}

function ensureGetCustomizedProductComponentsReturnsCorrectValues(){
    //TODO Implement this test after duplicate component array in store is fixed
}

function ensureGetCustomizedProductCustomizedMaterialImageReturnsCorrectValue(){
    const expectedImage = "material.jpg";
    const expectedMaterial = {
        image: expectedImage
    };
    VuexStore.default.replaceState({
        customizedProduct:{
            customizedMaterial: expectedMaterial
        }
    });
    const actualMaterialImage = VuexStore.getters.customizedMaterial(VuexStore.default.state);
    expect(actualMaterialImage).toBe(expectedImage);
}

function ensureGetCanMoveClosetReturnsCorrectValue(){
    const expectedFlag = true;
    VuexStore.default.replaceState({
        canvasControls:{
            canMoveCloset: expectedFlag
        }
    });
    const actualFlag = VuexStore.getters.canMoveCloset(VuexStore.default.state);
    expect(actualFlag).toBe(expectedFlag);
}

function ensureGetCanMoveSlotsReturnsCorrectValue(){
    const expectedFlag = true;
    VuexStore.default.replaceState({
        canvasControls:{
            canMoveSlots: expectedFlag
        }
    });
    const actualFlag = VuexStore.getters.canMoveSlots(VuexStore.default.state);
    expect(actualFlag).toBe(expectedFlag);
}

function ensureGetCanMoveComponentsReturnsCorrectValue(){
    const expectedFlag = true;
    VuexStore.default.replaceState({
        canvasControls:{
            canMoveComponents: expectedFlag
        }
    });
    const actualFlag = VuexStore.getters.canMoveComponents(VuexStore.default.state);
    expect(actualFlag).toBe(expectedFlag);
}

function ensureGetComponentToRemoveReturnsCorrectValue(){
    //TODO Implement test after duplicate components array is fixed
}

