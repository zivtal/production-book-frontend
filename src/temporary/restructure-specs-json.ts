// /* eslint-disable */
// import camera from '@/temporary/json/camera.json';
// import gimbal from '@/temporary/json/gimbal.json';
// import lens from '@/temporary/json/lens.json';
// import drone from '@/temporary/json/drone.json';
// import { newDb } from '@/temporary/db';
//
// console.log(
//   [...camera, ...lens, ...gimbal, ...drone]
//     .map((item: any) => {
//       const { model, brand, ...restSpecs } = item;
//
//       return {
//         title: model.includes(brand) ? model : `${brand} ${model}`,
//         specs: {
//           brand,
//           model: model.replace(brand, '').trim(),
//           ...restSpecs,
//         },
//       };
//     })
//     .sort((a, b) => a.title.localeCompare(b.title))
// );
//
// const db = newDb
//   .map((item: any) => {
//     const { model, brand, ...restSpecs } = item;
//
//     return {
//       title: model.includes(brand) ? model : `${brand} ${model}`,
//       specs: {
//         brand,
//         model: model.replace(brand, '').trim(),
//         ...restSpecs,
//       },
//     };
//   })
//   .sort((a, b) => a.title.localeCompare(b.title));
//
// db.forEach((item) => console.log(item));
