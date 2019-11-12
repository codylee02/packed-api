const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: "01f0d52c-c529-467b-81bc-486f53558aef",
      username: "dunder",
      first_name: "Dunder",
      last_name: "Mifflin",
      password: "$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne",
      date_created: "2019-11-06 22:26:24.065662"
    },
    {
      id: "bf87b68b-8de3-42bb-9857-a8750bcf1895",
      username: "b.deboop",
      first_name: "Bodeep Deboop",
      last_name: "Bo",
      password: "$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO",
      date_created: "2019-11-06 22:26:24.065662"
    },
    {
      id: "a191bd9e-ffd6-4fce-b4dc-6143ba11620b",
      username: "c.bloggs",
      first_name: "Charlie Bloggs",
      last_name: "Charlie",
      password: "$2a$12$2fv9OPgM07xGnhDbyL6xsuAeQjAYpZx/3V2dnu0XNIR27gTeiK2gK",
      date_created: "2019-11-06 22:26:24.065662"
    },
    {
      id: "2302cf21-92f7-4145-a48a-031e0d5e4376",
      username: "s.smith",
      first_name: "Sam Smith",
      last_name: "Sam",
      password: "$2a$12$/4P5/ylaB7qur/McgrEKwuCy.3JZ6W.cRtqxiJsYCdhr89V4Z3rp.",
      date_created: "2019-11-06 22:26:24.065662"
    },
    {
      id: "3cbed6a5-28bf-4813-88da-97130deeed7f",
      username: "lexlor",
      first_name: "Alex Taylor",
      last_name: "Lex",
      password: "$2a$12$Hq9pfcWWvnzZ8x8HqJotveRHLD13ceS7DDbrs18LpK6rfj4iftNw.",
      date_created: "2019-11-06 22:26:24.065662"
    },
    {
      id: "f7fa755d-733b-4c3a-b5ad-a6b8290e46cd",
      username: "wippy",
      first_name: "Ping Won In",
      last_name: "Ping",
      password: "$2a$12$ntGOlTLG5nEXYgDVqk4bPejBoJP65HfH2JEMc1JBpXaVjXo5RsTUu",
      date_created: "2019-11-06 22:26:24.065662"
    }
  ];
}

function makeListsArray(users) {
  return [
    {
      id: "1399c806-5c68-4358-830a-3803d8745c1e",
      name: "Weekend Camping Trip",
      date_created: "2019-11-06 22:26:24.065662",
      user_id: users[0].id
    },
    {
      id: "5fd72533-35b2-47e8-a696-f84b17c8e454",
      name: "School Daypack",
      date_created: "2019-11-06 22:26:24.065662",
      user_id: users[0].id
    },
    {
      id: "f12243d7-951c-4250-ae39-227ff87e36d5",
      name: "Wedding Photo Shoot",
      date_created: "2019-11-06 22:26:24.065662",
      user_id: users[2].id
    },
    {
      id: "bd37fdc7-f3dd-4872-8d8c-31a85a52e4a2",
      name: "Work Presentation",
      date_created: "2019-11-06 22:26:24.065662",
      user_id: users[3].id
    },
    {
      id: "995bb15f-b152-47f5-b03e-877e6ad51192",
      name: "Surfing Trip",
      date_created: "2019-11-06 22:26:24.065662",
      user_id: users[4].id
    }
  ];
}

function makeTemplatesArray(users) {
  return [
    {
      id: "e93c1802-8c16-4d06-a312-84359796449f",
      name: "Overnight Trip",
      date_created: "2019-11-06 22:26:24.065662",
      user_id: users[0].id
    },
    {
      id: "afb45b03-58f9-44ef-899d-61a3fbc4f9f9",
      name: "Daily Necessities",
      date_created: "2019-11-06 22:26:24.065662",
      user_id: users[0].id
    },
    {
      id: "b76b4c76-2cad-4d29-bfc5-da840d048127",
      name: "Photography Gig-Basic Package",
      date_created: "2019-11-06 22:26:24.065662",
      user_id: users[1].id
    },
    {
      id: "5c33c8c7-dfba-4004-8c9c-d8069f5a04ce",
      name: "Computer Bag",
      date_created: "2019-11-06 22:26:24.065662",
      user_id: users[2].id
    },
    {
      id: "1626c239-b872-4c0e-aee6-b29d31b8d634",
      name: "Beach Trip",
      date_created: "2019-11-06 22:26:24.065662",
      user_id: users[3].id
    }
  ];
}

function makeTemplateItemsArray(templates) {
  return [
    {
      id: "5fd85f4d-9fd9-4498-b237-f42690b067fe",
      name: "Shoes",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[0].id
    },
    {
      id: "561c9c38-e26e-4cee-af78-ced14f215a73",
      name: "Socks",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[0].id
    },
    {
      id: "5dbac38f-b77a-4593-8cf7-d833db38ea30",
      name: "Shirt",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[0].id
    },
    {
      id: "000a572f-26a1-42ac-9b1f-8f261fb461ce",
      name: "Pants",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[0].id
    },
    {
      id: "fb5d8517-58f8-4000-80b8-872a2f209128",
      name: "Jacket",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[0].id
    },
    {
      id: "86dd22fd-77fa-4164-b500-c93c17cccb5b",
      name: "Laptop",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[1].id
    },
    {
      id: "07e047bd-76db-4e5b-8cfb-e36555a4d353",
      name: "Laptop Charger",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[1].id
    },
    {
      id: "82a72d12-d3b2-4b47-a167-77d3cf96b374",
      name: "Phone Charger",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[1].id
    },
    {
      id: "e3e7faf5-25bd-4372-8c1f-dc88270b12e7",
      name: "Headphones",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[1].id
    },
    {
      id: "27a207f2-7bbf-4703-8d3e-785b514292a6",
      name: "External Battery",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[1].id
    },
    {
      id: "b7a052e7-dbd8-46dd-9f1b-933ae5aeea19",
      name: "Lunch",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[1].id
    },
    {
      id: "0c37f13f-1c6e-4920-8c0a-6512e391c02e",
      name: "Lens",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[2].id
    },
    {
      id: "a99d0215-46ce-4706-852c-0fbe371203e7",
      name: "Camera",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[2].id
    },
    {
      id: "727d3f7e-3fae-4c0b-9230-8dc353b2fca7",
      name: "Tripod",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[2].id
    },
    {
      id: "8b2e0716-bb12-4292-a134-fb1a0cfc190f",
      name: "Exra Batteries",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[2].id
    },
    {
      id: "75c63d34-2141-4efc-b47c-c574d44c9f60",
      name: "Extra Memory Cards",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[2].id
    },
    {
      id: "887472f1-fd7f-458c-b735-f8d989df73a5",
      name: "Remote",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[2].id
    },
    {
      id: "b55fb187-659d-4560-9b6e-68360cd3621a",
      name: "Backlighting",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[2].id
    },
    {
      id: "a83ce179-3a12-42b4-ac08-04064822c018",
      name: "Laptop",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[3].id
    },
    {
      id: "4534dd49-5c18-4bdc-ad35-ba128c12f224",
      name: "Headphones",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[3].id
    },
    {
      id: "a608ab21-52b2-44fa-9462-0ca9f6149ef2",
      name: "iPad",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[3].id
    },
    {
      id: "9db8dd49-c2e2-486d-b176-a247149136d0",
      name: "Phone Charger",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[3].id
    },
    {
      id: "0ea7ca7d-f548-4661-9119-784be582fa68",
      name: "Pens",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[3].id
    },
    {
      id: "0f2ccb88-2409-4637-972b-e9fc65897736",
      name: "Notebook",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[3].id
    },
    {
      id: "32497c3f-cd20-479c-8a8d-55aa3a7c4651",
      name: "Flash Drive",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[3].id
    },
    {
      id: "f727ca8c-9aa6-4937-b35f-e7eb77ee8510",
      name: "USB-C Adapter",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[3].id
    },
    {
      id: "2c7ec62b-135b-4971-a993-29006e69fcf6",
      name: "Swim Trunks",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[4].id
    },
    {
      id: "7d03e2bb-85db-4fc1-8ae8-195ccadfed11",
      name: "Flip Flops",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[4].id
    },
    {
      id: "ad7645ad-2c70-4577-9455-ab4f8add2651",
      name: "Towel",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[4].id
    },
    {
      id: "f449aae0-4af7-4e4c-9383-6225dcd4b5e1",
      name: "Sunscreen",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[4].id
    },
    {
      id: "0a16e21b-3714-4ee2-ab8f-67899bad8e1e",
      name: "Umbrella",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[4].id
    },
    {
      id: "d20831c5-21f4-4a5e-9b48-b90d4b732167",
      name: "Camera",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[4].id
    },
    {
      id: "dfab38e2-7f31-4e7c-bc93-9c46776091ef",
      name: "Cooler",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[4].id
    },
    {
      id: "b7c912bc-4a66-4475-a587-846231048731",
      name: "Firewood",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[4].id
    },
    {
      id: "288d69f3-4856-4b05-b4a0-fd4e4a20f9d7",
      name: "Rechargeable Speaker",
      date_created: "2019-11-06 22:26:24.065662",
      template_id: templates[4].id
    }
  ];
}

function makeListItemsArray(lists) {
  return [
    {
      id: "33cc99c7-6a8c-4385-920a-5b495dfeea08",
      name: "Wood",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[0].id
    },
    {
      id: "aa0b5863-3757-44c6-976d-c9e970222d3f",
      name: "Hiking Boots",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[0].id
    },
    {
      id: "259d7b3c-77b3-478b-a7f6-22734806e8ae",
      name: "Jacket",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[0].id
    },
    {
      id: "8b7b7648-1b75-4ddd-9690-d6a1ef77332f",
      name: "Chocolate",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[0].id
    },
    {
      id: "e683ca91-ffc5-4a8b-929c-1ab748913fac",
      name: "Graham Crackers",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[0].id
    },
    {
      id: "cee9b41d-674b-4ca9-aad8-8909df83a7ad",
      name: "Marshmallows",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[0].id
    },
    {
      id: "1e15473a-0d13-4662-863c-fa812c0f19ff",
      name: "Sleeping Bag",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[0].id
    },
    {
      id: "1241f538-8c06-49b1-82b4-7690acf2c9d0",
      name: "Outdoor Speaker",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[0].id
    },
    {
      id: "232d8345-1a22-4448-afec-dc37a77837f3",
      name: "Ukelele",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[0].id
    },
    {
      id: "353e7acd-661c-4014-aa2a-aa3ad26389f6",
      name: "Tent",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[0].id
    },
    {
      id: "769c687e-f555-4699-829b-54c63595a02b",
      name: "Laptop",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[1].id
    },
    {
      id: "49b36f26-7b01-4c64-af63-08985f493aba",
      name: "Laptop Charger",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[1].id
    },
    {
      id: "85d1538e-36c3-4c82-bb41-782a8f81f48d",
      name: "External Battery Pack",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[1].id
    },
    {
      id: "debb0ee1-4dd9-4352-8d2c-66716af75e14",
      name: "Headphones",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[1].id
    },
    {
      id: "c1c07a0f-0bad-4793-8eaf-37ce07e1ec23",
      name: "Lunch",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[1].id
    },
    {
      id: "a048048c-55c5-482c-84eb-f82d1494157b",
      name: "Calculator",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[1].id
    },
    {
      id: "fe47faa9-c3eb-4f16-8444-60832fb69a18",
      name: "Calculus Book",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[1].id
    },
    {
      id: "21ef1eaf-a939-4c4b-a694-a27891e970e3",
      name: "Camera",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "1a6d113b-19cd-46a4-b713-a26fdff0fcb2",
      name: "Lens 1",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "1a5562e8-3b95-4429-b20a-bfae9f3cbffb",
      name: "Lens 2",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "b90ca5d6-08fc-4079-9d7f-411c13fa8844",
      name: "Wide-angle Lens Adapter",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "64cbe126-83b3-4882-ae47-8a495e02761f",
      name: "3 Camera Batteries",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "224f7dc6-53a2-4d7c-86b2-62a13179d6f3",
      name: "Camcorder",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "a2210982-964c-461c-bd59-96870036535b",
      name: "Backdrop",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "87360129-63d1-40f8-964f-750ac2e1742c",
      name: "Backlight",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "4291d523-a379-4a84-87af-2e95d350e855",
      name: "Umberlla",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "10548efa-2dc9-43a3-9ba3-c136b7f45bce",
      name: "Tripod",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "7953b037-c618-46ee-b536-752f87183e3c",
      name: "Flash",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "f16b35cd-6b08-4ebf-88c9-8b5861766570",
      name: "Lenscap",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "8372ceee-f1a0-46e0-a320-d00655edf7f4",
      name: "Remote",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "e4df93dc-2fc9-494c-beb4-7621b5c5cf89",
      name: "Map of area",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "9a85ccfc-6e88-450f-93a2-890a42e1d17e",
      name: "Gimbal",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[2].id
    },
    {
      id: "b9164e24-715f-49d8-a936-c9b4a9730ca2",
      name: "Laptop",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[3].id
    },
    {
      id: "d06e6e74-aa35-4d35-9633-a4480b6b95dc",
      name: "Projector",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[3].id
    },
    {
      id: "1b44e738-5fdd-4990-9e27-92363fe1eaa2",
      name: "HDMI Cable",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[3].id
    },
    {
      id: "bb82fda1-7d74-4ab9-b575-7eac96a8b2f3",
      name: "Flash Drive",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[3].id
    },
    {
      id: "d4f2d7da-b234-4dce-a3a6-c40b8b190377",
      name: "Laptop Charger",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[3].id
    },
    {
      id: "deec7ac3-0ecc-4c5f-9ab6-ab0771d02c27",
      name: "Projector Screen",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[3].id
    },
    {
      id: "d53275d3-1b0b-4927-9e75-ab88db9ae902",
      name: "Presentation Remote",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[3].id
    },
    {
      id: "b8a59364-7ffa-4bba-ad8e-c2e7ba8868c5",
      name: "Laptop Stand",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[3].id
    },
    {
      id: "5e4c3db8-2de8-4080-b5bd-76d11db4e043",
      name: "Pens",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[3].id
    },
    {
      id: "c7184e95-0856-494f-af1d-5484c6e48dfc",
      name: "iPad",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[3].id
    },
    {
      id: "6917131f-1d61-4c27-8656-fe20be7cde33",
      name: "Notebook",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[3].id
    },
    {
      id: "fb2efe33-8f48-4798-960b-fb2c2b7c7c24",
      name: "Surfboard",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[4].id
    },
    {
      id: "9df8ac10-397c-41da-94a0-7dcdf780a0eb",
      name: "Fishing Pole",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[4].id
    },
    {
      id: "8f09079a-b12d-4e06-8daa-2de58a9c34c7",
      name: "Swim Trunks",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[4].id
    },
    {
      id: "62fe5e6e-80c9-48ae-afca-c744b5e2c4c3",
      name: "Sunscreen",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[4].id
    },
    {
      id: "69ad24e5-23a6-436d-99b1-0342cd0b0028",
      name: "Flip-flops",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[4].id
    },
    {
      id: "6dc15da3-ab70-4115-9d41-7a62716d5379",
      name: "Hat",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[4].id
    },
    {
      id: "46259083-9ac3-442a-a32d-d3a2b76c4898",
      name: "Towel",
      packed: false,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[4].id
    },
    {
      id: "06fb4045-e93f-400d-aa1e-170047ff0090",
      name: "Goggles",
      packed: true,
      date_created: "2019-11-06 22:26:24.065662",
      list_id: lists[4].id
    }
  ];
}

function makePAKDFixtures() {
  const testUsers = makeUsersArray();
  const testLists = makeListsArray(testUsers);
  const testTemplates = makeTemplatesArray(testUsers);
  const testListItems = makeListItemsArray(testLists);
  const testTemplateItems = makeTemplateItemsArray(testTemplates);
  return {
    testUsers,
    testLists,
    testTemplates,
    testListItems,
    testTemplateItems
  };
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.into("pakd_users").insert(preppedUsers);
  // .then(() =>
  //   // update the auto sequence to stay in sync
  //   db.raw(`SELECT setval('pakd_users_id_seq', ?)`, [
  //     users[users.length - 1].id
  //   ])
  // );
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
        pakd_template_items,
        pakd_list_items,
        pakd_templates,
        pakd_lists,
        pakd_users
        RESTART IDENTITY CASCADE`
  );
}

module.exports = {
  makeUsersArray,
  makeListsArray,
  makeTemplatesArray,
  makeTemplateItemsArray,
  makeListItemsArray,

  makePAKDFixtures,
  seedUsers,
  cleanTables
};
