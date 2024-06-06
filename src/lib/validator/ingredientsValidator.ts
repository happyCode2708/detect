export const ingredientsValidator = async (modifiedProductDataPoints: any) => {
  const process = modifiedProductDataPoints['process'] || {};

  const other_ingredients_group =
    modifiedProductDataPoints['other_ingredients_group'] || [];
  const ingredients_group =
    modifiedProductDataPoints['ingredients_group'] || [];

  const { live_and_active_cultures } = process;

  console.log('start ingredients validator');

  if (!live_and_active_cultures?.statement) return;

  if (other_ingredients_group?.length > 0) {
    modifiedProductDataPoints['validated_other_ingredients_group'] = [
      ...other_ingredients_group,
      {
        ingredients_statement: live_and_active_cultures?.statement || '',
        ingredients: live_and_active_cultures?.list_break_out || [],
      },
    ];
  }

  if (ingredients_group?.length > 0) {
    modifiedProductDataPoints['validated_ingredients_group'] = [
      ...ingredients_group,
      {
        ingredients_statement: live_and_active_cultures?.statement || '',
        ingredients: live_and_active_cultures?.list_break_out || [],
      },
    ];
  }

  console.log(JSON.stringify(modifiedProductDataPoints['ingredients_group']));

  console.log('ingredients validator -- finish');
};
