export const NEW_PROMPT = `
Carefully examine the provided image and return only a json in neatly object format:
json
{
  "product": {
    "isFactPanelGoodToRead": [{"answer": string},...],
    "factPanels": null or  [
      {
        "panelName": string ,
        "amountPerServing": {"name": string?},
        "calories": {"value": float?, "uom": "calories"}
        "servingSize": {"description": string?, "value": string, "uom": string,},
        "servingPerContainer":" {"value": float? or number?, "uom": string},
        "nutrients": [
          {
            "name": string, 
            "descriptor": string,
            "quantityComparisonOperator": string?, value: float?, uom: string, 
            "quantityDescription": string?,
            "dailyPercentComparisonOperator": string?, 
            "percentDailyValue": float,  
            "footnoteIndicator": string?,
          }
        ],
        "footnote": {
          "value": string?,
          "footnoteIndicatorList": string[],
        },
      }
    ],
    "ingredientsGroup": [{"ingredients": string[]}],
    "allergen: {
      "contain": string,
      "containOnEquipment": {"statement": string, "allergenList: string[] },
    },
    "header": {
      "productName": string,
      "brandName": string,
      "primarySize": {
        "primarySizeValue": string,
        "primarySizeUom": string,
        "primarySizeText": string,
      },
      "secondarySize": {
        "secondarySizeValue": string,
        "secondarySizeUom": string,
        "secondarySizeText": string,
      }
      "sizeTextDescription": string,
      "count": number
    },
    "packaging": {
      "containerMaterialType": string,
      "containerType": string,
      "packagingDescriptors": string[],
    },
    "attributes": {
      "claimsOrCertifications": [{"value": string, "isClaimGetFromLogo": "Answer Question is claim statement info is from a certification logo? return yes or no" }, ...],
    },
    "physical": {
      "upc12": number,
    },
    "marketingAll": {
      "marketingContents": string[],
      "copyrightOrTradeMark": string,
      "sologan": string,
      "website": string,
      "socialMedia": {
        "socialList": string[],
        "socialMediaText": string[],
      },
    },
    "supplyChain": {
      "CountryOfOrigin": string,
      "CountryOfOriginText": string,
      "manufactureDate": string,
      "manufacturePhoneNumber": number,
      "manufactureStreetAddress": string,
      "manufactureCity": string,
      "manufactureState": string,
      "manufactureZipcode": string,
      "manufactureName": string,
    }
    "instructions": {
      "otherInstruction": string[],
      "consumerStorageInstructions": string[],
      "cookingInstructions": string[],
      "usageInstructions": string[],
    },
    "certifications: [{
      "cetificationName": string,
      "certificationOriginCountry": string,
      "certificationProvider": string,
    },...]
  },
}

The Most Important rule:
+ Only get data that visibly seen by normal eyes not from other sources on internet
+ Remind again if you see fact panel just give detail data that could be seen by human eyes not from other source like internet.
+ Only get ingredients data that visibly seen by normal eyes not from other sources on internet.
+ Remind you again only provide the data visibly on provided image, and must be detected by human eyes not from other source on internet.

Some common constants:
+ FOOTNOTE_INDICATORS = ["*", "**", "†", "★★", "★"]

Some definitions:
1) about the "Fact Panel"
+ is a list of nutrient or substance info
+ must have a Big Text like a Header such as "Nutrition Facts" or "Supplement Facts" visible on it
+ be careful when you (gemini) confirm to see something since curvature of container or cropped image can make content obscured.

Some common rules:
+ "nutrients" is an array that usually start with some nutrients such as "Total Carbohydrate", "Vitamin A", ... Let's list nutrient from them first if possible.
+ Read "Fact Panel" from left to right and from top to bottom.
+ content in prompt can be similar to typescript and nodejs syntax.
+ be careful the last "nutrient row" could be misread to be a part of "footnote". Remember "footnote" content ususally about "Daily value" or "percent daily value" note.
+ do not return json in format [{product: {...}}] since the result is only for one product

Some rule for you:
1) "product.isFactPanelGoodToRead" = array of answers of all below questions:
+ Carefully inspect the image and answer question Can you see the fact panel? return "yes" or "no" only
+ Can you see "serving size info" from fact panel? return "yes" or "no" only
+ is the exact text "Supplement Facts" or "Nutrition Facts" 100% visible on provided image. Carefully inspect the image and do not assume that text on the image ? return "yes" or "no" only

2) Notations like 'Includes 7g of Added Sugars' should be recorded as "name": "Added Sugars", "value": 7, "uom": "g".

3) The fact panel could be in the "dual-column" layout showing both "per serving" and "per container" information, or different "% Daily value" by age. Let's to break down and separate into two different fact panels one is for 'per serving'
and other for 'per container' just if "amoutPerServing.name" of them are different or "servingSize" of them are different. These two fact panels have the same value of "servingPerContainer", "footnote', "ingredients", and "contain".

4) "factPanels.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

5) "servingSize":
+ if "servingSize" content contains the parentheses so "servingSize" format = servingSize.description + "("+ servingSize.value + servingSize.uom ")" 
+ else "servingSize" format = servingSize.value + servingSize.uom
Ex 1: "10 tablespoons(80g)" = {servingSize: {"description": "10 tablespoons", "value": "80", "uom": "g"}}
Ex 2: "10 tablespoons" = {servingSize: {"value": 10, "uom": "tablespoons"}}

6) "footnote":
+ "footnote" must be the last part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS),
and must be a note contain "Daily Value....", or "Not a significant source...".
+ "footnote" is only one section, and is not multiple sections.
+ "footnote.footnoteIndicatorList" is a list of special characters found in "footnote.value"
+ "footnote.value" contains all specials symbol from "footnote.footnoteIndicatorList"
+ "footnote.footnoteIndicatorList" only contain character from FOOTNOTE_INDICATORS
Ex 1: "**Not a significant source of saturated fat, trans fat. *Daily Value not established. = {footnote: {value :"**Not a significant source of saturated fat, trans fat. *Daily Value not established.", footnoteIndicatorList: ["*", "**"]}}
Ex 2: "*Daily Value not established." = {footnote: {value: "*Daily Value not established.", footnoteIndicatorList": ["*"]}}
Ex 3: "†Daily Value not established." = {footnote: {value: "†Daily Value not established.", footnoteIndicatorList": ["†"]}}
Ex 4: "Not a significant source of saturated fat, trans fat." = {footnote:{value: "Not a significant source of saturated fat, trans fat.", footnoteIndicatorList: null}}

7) "nutrients.footnoteIndicator":
+ "nutrients.footnoteIndicator" is a special symbol such as "*", "†" or is a group of special symbol such as "**" beside the nutrient percent value. Sometimes nutrient percent value is left empty but still have footnoteIndicator right there.

8) "amountPerServing.name":
+ is a text and usually stay above the "calories value number",
Ex 1: "Per container", "Per serving"

9) "nutrient.quantityComparisonOperator" and "nutrient.dailyPercentComparisonOperator" rules:
+ "nutrient.quantityComparisonOperator" is a comparison operator at the left side of "nutrient.value" and "nutrient.uom"
+ "nutrient.dailyPercentComparisonOperator" is a comparison operator at the left side of "nutrient.percentDailyValue".
+ "nutrient.dailyPercentComparisonOperator" is not "nutrient.quantityComparisonOperator".
Ex 1: "10g    <10%" = {quantityComparisonOperator: null, dailyPercentComparisonOperator: "<", ...}
Ex 2: "<10g    10%" = {quantityComparisonOperator: "<", dailyPercentComparisonOperator: null, ...}
Ex 3: "<10g    <10%" ={quantityComparisonOperator: "<", dailyPercentComparisonOperator: "<", ...}

10) "nutrients.quantityDescription":
+ is additional text right next to "nutrient.uom" and inside the parentheses, and does not include parentheses.
Ex 1: "20mcg(800 IU)" = {quantityDescription: "800 IU"}
Ex 2: "20mcg DFE(800mcg L-5-MTHF) = {quantityDescription: "800mcg L-5-MTHF"}


11) "ingredientsGroup.ingredients":
+ usually appear below or next to the nutrition panel and start with a prefix of "ingredients:" or "Ingredients:" or "INGREDIENTS:" or "Other Ingredients:".
+ "ingredientsGroup.ingredients" does not include that prefix
Ex 1: "Ingredients: Flour, Eggs,"= {ingredients: "Flour, Eggs."}

12) "physical.upc12" rules:
+ extract possible "upc12" or "UPC-A" 's barcode number (with 12 digits)  of product from given image.
+ "physical.upc12" must have 12 digit number if you do not get enough 12 gigits just look around the nearest area you may find some missing digit number.
+ upc12 could be easily detected at the bottom of the barcode
Ex 1: "0    33445   44421    5" =  {"upc12": "033445444215"}

13) "marketingAll" rules:
a) "marketingAll.website":
+ find website link
+ website link exclude "nongmoproject.org"
+ be careful the content after slash could be phone number
Ex 1: text "www.test.com/999.444.3344" should be recorded as {website: "www.test.com", ...} since the number after slash is phone number

b) "marketingAll.socialMedia":
+ "socialMedia.socailList" is the name list of all social media info provided on product image such as facebook, pinterest, instagram, twitter, threads,... carefully check the social media logo/icon or social media link.
keep asking yourself question like "Do I see Pinterest logo?" to find all social media methods and add to "socialMedia.socailList"
+ "socialMedia.socialMediaText" is a list of text usually start with "@" that can be used to search the product on social media. Hint, it is usually next to social media icons
Ex: "@cocacola" 

c) "marketingContents" rules:
+ "marketingContents" is texts to introduce or marketing features or benefits of product, and usually appear on the front face of product or some marketing pharagraph to appeal customer.
+ there could be also marketing contents which are texts about nutrients appear on the main face of product to appeal customer to buy product

d) "sologan" rules:
+ "sologan" is a highlight text to praise product.

e) "copyrightOrTradeMarkOrRegistration" rules:
+ "copyrightOrTradeMarkOrRegistration" is trademark, copyright or registration statement of product could start with symbols below or contain symbol below:
™ - stands for a trademark;
® - stands for a registered trademark;
© - stands for copyright.
+ the "copyrightOrTradeMarkOrRegistration" usually contain strings such as "registered trademark"

15) "header" rules:
a) "header.productName" :
+ extract possible name of product from given image.

b) "header.brandName":
+ find brand name

c) "header.primarySize" and "header.secondarySize" rules:
+ "header.primarySize" or "header.secondarySize" is a quantity measurement of product in two different unit of measurement
+ "primarySizeUom" and "secondarySizeUom" is "Units of Liquid Measurement" (such as "Fl OZ", "L", ...) or "Weight Units of Measure" (such as "Gram", "Kg", ...)
+ "primarySizeUom" and "secondarySizeUom" exclude "calories"
Ex 1: "Net 3 Qt. (96 fl. oz.) 2.835L" should be recorded as 
{
  "primarySize": {"primarySizeValue": 96  , "primarySizeUom": "fl. oz." , "primarySizeText": "96 fl. oz." }, 
  "secondarySize": {"secondarySizeValue": 2.835  , "secondarySizeUom": "L" , "secondarySizeText": "2.835L" }
}
Ex 2: "64 FL OZ(2QTs) 1.89L" should be recorded as 
{
  "primarySize": {"primarySizeValue": 64 , "primarySizeUom": "FL OZ" , "primarySizeText": "64 FL OZ"},
  "secondarySize": {"secondarySizeValue": 1.89  , "secondarySizeUom": "L" , "secondarySizeText": "1.89L" }
}
Ex 3: "Net WT 5.25 OZ 150g" should be recorded as 
{
  "primarySize": {"primarySizeValue": 5.25 , "primarySizeUom": "OZ" , "primarySizeText": "5.25 OZ"},
  "secondarySize": {"secondarySizeValue": 150  , "secondarySizeUom": "g" , "secondarySizeText": "150g" },
}

d) "header.count":
+ is the count number of smaller unit inside a packagge, or a display shipper, or a case, or a box.
Ex: there are 15 cookies in the packages so {"count": 15}

e) "header.sizeTextDescription":
+ is the whole quantity measurement description statement of the product on image. It is usually appear on the front face of product.

16) "packaging" rules:
a) "packaging.containerMaterialType":
+ is the type of material is used to make the package such as "paper", "plastic", or "metal", ...

b) "packaging.containerType":
+ is the type of package such as "box", "bottle", "bag", "tube", or "shrink wrapped"

c) "packaging.packagingDescriptors"
+ is a list statement of packaing materials.

17) "allergen" rules:
a) "allergen.contain" rules:
+ "contain" is a list of ingredient could make customer allergen.
Ex 1: "May contain milk" should be recorded as {"contain": "milk"} 
Ex 2: "Contain: Coconut, Milk." should be recorded as {"contain": "Coconut, Milk"}

b) "allergen.containOnEquipment" rules:
+ "containOnEquipment.allergenList" is a list of allergen ingredients on manufacturing equipments.
+ "containOnEquipment.statement" is the context about manufacturing equipment contain allergen ingredient list.

18) "nutrients" rules:
a) "nutrients.descriptor" rules:
+ "nutrients.descriptor" could be the text that is intended and appear on the row below a nutrient.
+ "nutrients.descriptor" could also be the text inside the parentheses right next to "nutrients.name"

b) "nutrients.name" rule:
+ "nutrients.name" is a name of nutrient sometimes include the text closed inside the parentheses.
+ "nutrients.name" sometimes start with a special symbol or its name is bold and maybe a note just like name of an ingredient
Ex 1: "Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)" should be recorded as {"name": "Vitamin K2", "descriptor": "as Naturally Derived MK-7 [Menaquinone-7": ,...}
Ex 2: "Medium Chain Triglyceride (MCT) Oil" should be recorded as {"name": "Medium Chain Triglyceride (MCT) Oil", ...} 

c) "nutrients.uom" rules:
+ some possible "nutrients.uom" such as "MCG DFE"

19) "amountPerServing.name" rules:
+ is a text and usually stay above the "calories value number".
+ "amountPerServing.name" could be a text below "%Daily Value" Header such as "for children...", or "for aldults..."
Ex 1: "Per container", "Per serving"

20) "attributes" rules:
a) "atributes.claimsOrCertifications" rules:
+ for "atributes.claimsOrCertifications" gemini you are allowed to access the external source from internet to verfiy if detected "certified logo" is valid. Some product may use a logo for a claim but it could be invalid "certified logo"
+ one "claims" item could be the statement text wihtout certified logo or it also could be from a "certified logo" or is near a "certified logo".
+ is a list of "claimsOrCertification" on provided image could be about
ADA
Authen Product by Amerian indians
bee better
bio dynamic
bioengineered
business owner
Carbon Footprint
CBD hemp
kosher
...

21) "supplyChain":
+  "supplyChain.countryOfOriginText" is the statement express country in where product was made. Ex: Made in USA
+  "supplyChain.countryOfOrigin" is the country name in where product was made. Ex: "USA"

22) "instructions" rules:
`;

// 23) "certifications" rules:
// + "certifications" is the list of certifcation infos
// + "cetificationName" is the full name of certification.
// + "certificationOriginCountry" is the country that certification come from.
// + "certificationProvider" is the name of organization or any one that certify the product to provide the certification.
// + some certification could be "gluten free...", "Glyphosate Residue Free", ...
// + it is normal if "attributes.claims" item info is similar to "certifications" item info.

//  27) "claimsWithNoLogo" rules:
//  + "claimsWithNoLogo" all items from "product.claims" that have "isTextOnLogo" = "no"
// "claimsWithNoLogo": [{"value": string}],

// 28) "certifications" rules:
// + "certifications" is the answer of question what certifications you can see in provided images? return the standard name of these certifications
// + "certifications" field is allowed to use external source from internet to get stardard name of each certification

// + certification standard format = "Certified" + "Certified Name" + "by" + "certification organization name".
// certification = "Certified" + "Certified Name" + "by" + "certification organization full name".
// Ex 1: Certified Vegan by Vegan.org, Certified Gluten-Free by the Gluten-Free Certification Organization (GF)
// + Remind again if you see fact panel just give detail data that could be seen by human eyes.
// + Only get ingredients data that visibly seen by normal eyes not from other sources on internet.

// "claims": [{"value": string, "isTextOnLogo": "Answer Question is claim text on a certification logo? return yes or no" }, ...],
// "claimsWithNoLogo": [{"value": string}],
