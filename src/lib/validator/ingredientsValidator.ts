export const ingredientsValidator = async (modifiedProductDataPoints: any) => {
  const process = modifiedProductDataPoints['process'] || {};

  const other_ingredients_group =
    modifiedProductDataPoints['other_ingredients_group'] || [];
  const ingredients_group =
    modifiedProductDataPoints['ingredients_group'] || [];

  const { live_and_active_cultures } = process;

  console.log('start ingredients validator');

  if (!live_and_active_cultures?.statement) {
    if (other_ingredients_group?.length > 0) {
      modifiedProductDataPoints['validated_other_ingredients_group'] = [
        ...other_ingredients_group,
      ];
      return;
    }
    if (ingredients_group?.length > 0) {
      modifiedProductDataPoints['validated_ingredients_group'] = [
        ...ingredients_group,
      ];
      return;
    }
  }

  if (other_ingredients_group?.length > 0) {
    modifiedProductDataPoints['validated_other_ingredients_group'] = [
      ...other_ingredients_group,
      {
        ingredients_statement: live_and_active_cultures?.statement || '',
        // ingredients: live_and_active_cultures?.list_break_out || [],
      },
    ];
    return;
  }

  if (ingredients_group?.length > 0) {
    modifiedProductDataPoints['validated_ingredients_group'] = [
      ...ingredients_group,
      {
        ingredients_statement: live_and_active_cultures?.statement || '',
        // ingredients: live_and_active_cultures?.list_break_out || [],
      },
    ];
    return;
  }

  console.log('ingredients validator -- finish');
};

const validateIngredientBreakdown = () => {};
