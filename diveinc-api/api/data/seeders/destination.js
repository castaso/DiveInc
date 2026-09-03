'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('destinations', [{
      id: "44409e4d-3d44-222b-8a55-2263ee2d31fc", 
      country_id: "55509e4d-2f74-2222-8a5a-2264fe2d31fc",
      name: 'Bali',
      tag_line: 'The Land of God',
      description: 'A paradise with much to offer, both above and below the waves. Get ready to immerse yourself in a vibrant and diverse culture like no other!',
      introduction: 'Bali is the paradise you see on postcards, the trip you’ve been dreaming of, and the mood you’ll be talking about for a long time. It’s the perfect place for you to find your zen and get that adrenaline pumping adventure. You’ll find yourself thoroughly impressed with how Bali takes to heart the Hindu emphasis on balance.',
      highlight: JSON.stringify([
          {
              id : "123456789",
              value : "Explore the famed Liberty Wreck and go wall (Drop-off) diving at Tulamben"
          },
          {
            id : "234561",
            value : "Get a close up look at the Manta Rays & Mola Mola at Nusa Penida"
          },
          {
            id : "23498237498561",
            value : "Search for all kinds of fascinating creatures like Mimic Octopus, Frogfish, Ghost Pipefish, Pygmy Seahorses at Bali’s spectacular muck diving sites"
          }
      ]),
      image_background: JSON.stringify([
        {
            id: '21423534523982',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '63284764283',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '0495684586745968',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '2346287346234723',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '892734827345234',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '283468273462834',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        }
      ]),
      image_showing: JSON.stringify([
        {
            id: '21423534523982',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '63284764283',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '0495684586745968',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '2346287346234723',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '892734827345234',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '283468273462834',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        }
      ]),
      image_galery: JSON.stringify([
        {
            id: '21423534523982',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '63284764283',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '0495684586745968',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '2346287346234723',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '892734827345234',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        },
        {
            id: '283468273462834',
            baseUrl: 'https://cache.desktopnexus.com/',
            url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
            path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
        }
      ]),
      about: `
        <p>Bali is one of the many islands in the world’s largest archipelago, Indonesia. Though it may be one of the smaller islands in a nation that boasts diversity, Bali is quite the cultural wonder.</p>
        <p>Drawing in travelers like no other, Bali prides itself on its unequalled spirituality, sacred mountains and temples, verdant rice fields, iconic beaches, lively nightlife, and tasteful resorts and culinary options. Best part of it all? Travelers and divers of all kinds have the same chance of enjoying this one of a kind island. From five star resorts to backpacker hotels, gentle drifts to strong, challenging currents, Bali has them all.</p>
      `,
      more_about: JSON.stringify([
        {
            id: '345346546',
            type: 'text',
            key: 'Country',
            value : 'Indonesia'
        },
        {
            id: '982343290',
            type: 'text',
            key: 'When to Visit',
            value : 'April to October – The best weather is from May to September'
        },
        {
            id: '8273468234',
            type: 'link',
            key: 'Country',
            value : 'https://en.wikipedia.org/wiki/Bali'
        },
      ]),
      more_info: JSON.stringify([
        {
            id: '84579348',
            title: 'How to Get There',
            text: `
            <div class="col-lg-6 col-md-12">
                <p>Flights to Ngurah Rai International Airport, Bali’s main airport, are plenty. Travelers can find flights from the rest of Indonesia, SouthEast Asia, Australia, Hong Kong, and Japan, as well as from Europe and the US through connecting flights, making the airport the second busiest in the country after the capital’s airport (Soekarno-Hatta International Airport, Jakarta, Indonesia).</p>
                <p>Ngurah Rai International Airport is 30 minutes away from Denpasar, and a one hour drive from Kuta. Once arrived, travelers can easily find taxis with fixed or metered rates, or get on public buses (have a limited route)  and make use of hotel shuttles when available, if travelling on a budget.</p>
                <p>Bali can also be reached by ferry rides from Java. The ride lasts about half an hour from Ketapang (Java) to Gilimanuk (Bali). </p>
            </div>
            `,
        },
        {
            id: '8237492834',
            title: 'Weather in Bali',
            text: `
            <div class="col-lg-6 col-md-12">
                <p>As part of the tropics, Bali only has two seasons, the dry season and the rainy season. The dry season lasts from April to October and is the best season for diving, given the rainy season, which lasts from December to March, reduces visibility.</p>
                <p>For a real chance to encounter the Mola Mola, May to OctoberSeptember is the optimal time when the wind picks up and colder water moves up to the surface in some area sometime water temperature can drop until 16-20 degrees.. Outside of this period, water temperature is generally 24-28 degrees.</p>
                <p>Day time temperatures stay around 30-32 degrees and the air, humid. The best weather in Bali can be enjoyed on summer nights when the air is cooler and less humid.</p>
            </div>
            `,
        },
      ]),
      article: `
        <div class="col-lg-9 col-md-12 text-center">
            <h6 class="text-muted">Diving in Bali</h6>
            <h5 class="mb-5 font-weight-normal">Bali is the part of the coral triangle of Indonesia. Bali’s dive sites are as diverse as its culture. Spread out in different locations, with a rich marine life that’ll leave you in awe.</h5>
            <img src="https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg" class="d-block w-100 mb-5">
            <div class="d-block">
                <div class="row text-left">
                    <div class="col-md-6">
                        <p>You’ll find highly accessible dive sites, suitable for all levels, at Tulamben and Amed where the famed Liberty Wreck is located and the Seraya Secrets in Amed, home to a diversity of critters and a must for muck diving enthusiasts, just a few kilometers away. For an even easier scenic dive, you can visit Menjangan Island, near the peaceful Pemuteran village, where a little of everything is available--coral reefs, mucks, macro, walls, and stunning statues.</p>
                        <p>A trip to Padang Bai, the port to Lombok and the Gilis, also opens the way to the best dive spots for advanced divers. Gili Mimpang, Biaha, and Gili Tepekong offers reefs, walls, exhilarating currents, and close up encounters with sharks and occasionally, the Mola Mola.</p>
                    </div>
                    <div class="col-md-6">
                        <p>More experienced divers can also go for the big fishes in Nusa Penida and Nusa Lembongan, where Manta Rays are regulars and the chance of seeing Mola Molas are bigger, what with the upwellings.</p>
                        <p>These wondrous diving destinations are now supported by reliable dive equipment stores, a certified recompression chamber, and various dive centers spread across Bali.</p>
                    </div>
                </div>
                
                
            </div>
        </div>
      `,
      active: true,
      created_by: JSON.stringify({
        type : "seeder",
        id : "",
        description : "Seeder create first country"
      }),
      created_at: new Date()
    },{
        id: "22409e4d-3d4e-bb22-8885-2263ee2d31fc", 
        country_id: "55509e4d-2f74-2222-8a5a-2264fe2d31fc",
        name: 'Lombok',
        tag_line: 'Beach Paradise',
        description: 'A paradise with much to offer, both above and below the waves. Get ready to immerse yourself in a vibrant and diverse culture like no other!',
        introduction: 'Bali is the paradise you see on postcards, the trip you’ve been dreaming of, and the mood you’ll be talking about for a long time. It’s the perfect place for you to find your zen and get that adrenaline pumping adventure. You’ll find yourself thoroughly impressed with how Bali takes to heart the Hindu emphasis on balance.',
        highlight: JSON.stringify([
            {
                id : "123456789",
                value : "Explore the famed Liberty Wreck and go wall (Drop-off) diving at Tulamben"
            },
            {
              id : "234561",
              value : "Get a close up look at the Manta Rays & Mola Mola at Nusa Penida"
            },
            {
              id : "23498237498561",
              value : "Search for all kinds of fascinating creatures like Mimic Octopus, Frogfish, Ghost Pipefish, Pygmy Seahorses at Bali’s spectacular muck diving sites"
            }
        ]),
        image_background: JSON.stringify([
          {
              id: '21423534523982',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '63284764283',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '0495684586745968',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '2346287346234723',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '892734827345234',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '283468273462834',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          }
        ]),
        image_showing: JSON.stringify([
          {
              id: '21423534523982',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '63284764283',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '0495684586745968',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '2346287346234723',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '892734827345234',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '283468273462834',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          }
        ]),
        image_galery: JSON.stringify([
          {
              id: '21423534523982',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '63284764283',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '0495684586745968',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '2346287346234723',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '892734827345234',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '283468273462834',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          }
        ]),
        about: `
          <p>Bali is one of the many islands in the world’s largest archipelago, Indonesia. Though it may be one of the smaller islands in a nation that boasts diversity, Bali is quite the cultural wonder.</p>
          <p>Drawing in travelers like no other, Bali prides itself on its unequalled spirituality, sacred mountains and temples, verdant rice fields, iconic beaches, lively nightlife, and tasteful resorts and culinary options. Best part of it all? Travelers and divers of all kinds have the same chance of enjoying this one of a kind island. From five star resorts to backpacker hotels, gentle drifts to strong, challenging currents, Bali has them all.</p>
        `,
        more_about: JSON.stringify([
          {
              id: '345346546',
              type: 'text',
              key: 'Country',
              value : 'Indonesia'
          },
          {
              id: '982343290',
              type: 'text',
              key: 'When to Visit',
              value : 'April to October – The best weather is from May to September'
          },
          {
              id: '8273468234',
              type: 'link',
              key: 'Country',
              value : 'https://en.wikipedia.org/wiki/Bali'
          },
        ]),
        more_info: JSON.stringify([
          {
              id: '84579348',
              title: 'How to Get There',
              text: `
              <div class="col-lg-6 col-md-12">
                  <p>Flights to Ngurah Rai International Airport, Bali’s main airport, are plenty. Travelers can find flights from the rest of Indonesia, SouthEast Asia, Australia, Hong Kong, and Japan, as well as from Europe and the US through connecting flights, making the airport the second busiest in the country after the capital’s airport (Soekarno-Hatta International Airport, Jakarta, Indonesia).</p>
                  <p>Ngurah Rai International Airport is 30 minutes away from Denpasar, and a one hour drive from Kuta. Once arrived, travelers can easily find taxis with fixed or metered rates, or get on public buses (have a limited route)  and make use of hotel shuttles when available, if travelling on a budget.</p>
                  <p>Bali can also be reached by ferry rides from Java. The ride lasts about half an hour from Ketapang (Java) to Gilimanuk (Bali). </p>
              </div>
              `,
          },
          {
              id: '8237492834',
              title: 'Weather in Bali',
              text: `
              <div class="col-lg-6 col-md-12">
                  <p>As part of the tropics, Bali only has two seasons, the dry season and the rainy season. The dry season lasts from April to October and is the best season for diving, given the rainy season, which lasts from December to March, reduces visibility.</p>
                  <p>For a real chance to encounter the Mola Mola, May to OctoberSeptember is the optimal time when the wind picks up and colder water moves up to the surface in some area sometime water temperature can drop until 16-20 degrees.. Outside of this period, water temperature is generally 24-28 degrees.</p>
                  <p>Day time temperatures stay around 30-32 degrees and the air, humid. The best weather in Bali can be enjoyed on summer nights when the air is cooler and less humid.</p>
              </div>
              `,
          },
        ]),
        article: `
          <div class="col-lg-9 col-md-12 text-center">
              <h6 class="text-muted">Diving in Bali</h6>
              <h5 class="mb-5 font-weight-normal">Bali is the part of the coral triangle of Indonesia. Bali’s dive sites are as diverse as its culture. Spread out in different locations, with a rich marine life that’ll leave you in awe.</h5>
              <img src="https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg" class="d-block w-100 mb-5">
              <div class="d-block">
                  <div class="row text-left">
                      <div class="col-md-6">
                          <p>You’ll find highly accessible dive sites, suitable for all levels, at Tulamben and Amed where the famed Liberty Wreck is located and the Seraya Secrets in Amed, home to a diversity of critters and a must for muck diving enthusiasts, just a few kilometers away. For an even easier scenic dive, you can visit Menjangan Island, near the peaceful Pemuteran village, where a little of everything is available--coral reefs, mucks, macro, walls, and stunning statues.</p>
                          <p>A trip to Padang Bai, the port to Lombok and the Gilis, also opens the way to the best dive spots for advanced divers. Gili Mimpang, Biaha, and Gili Tepekong offers reefs, walls, exhilarating currents, and close up encounters with sharks and occasionally, the Mola Mola.</p>
                      </div>
                      <div class="col-md-6">
                          <p>More experienced divers can also go for the big fishes in Nusa Penida and Nusa Lembongan, where Manta Rays are regulars and the chance of seeing Mola Molas are bigger, what with the upwellings.</p>
                          <p>These wondrous diving destinations are now supported by reliable dive equipment stores, a certified recompression chamber, and various dive centers spread across Bali.</p>
                      </div>
                  </div>
                  
                  
              </div>
          </div>
        `,
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create first country"
        }),
        created_at: new Date()
      },{
        id: "22409e4d-443d-2bb2-5885-2263ee2d31fc", 
        country_id: "55509e4d-2f74-2222-8a5a-2264fe2d31fc",
        name: 'Nusa Penida',
        tag_line: 'Enjoy Diving Experience',
        description: 'A paradise with much to offer, both above and below the waves. Get ready to immerse yourself in a vibrant and diverse culture like no other!',
        introduction: 'Bali is the paradise you see on postcards, the trip you’ve been dreaming of, and the mood you’ll be talking about for a long time. It’s the perfect place for you to find your zen and get that adrenaline pumping adventure. You’ll find yourself thoroughly impressed with how Bali takes to heart the Hindu emphasis on balance.',
        highlight: JSON.stringify([
            {
                id : "123456789",
                value : "Explore the famed Liberty Wreck and go wall (Drop-off) diving at Tulamben"
            },
            {
              id : "234561",
              value : "Get a close up look at the Manta Rays & Mola Mola at Nusa Penida"
            },
            {
              id : "23498237498561",
              value : "Search for all kinds of fascinating creatures like Mimic Octopus, Frogfish, Ghost Pipefish, Pygmy Seahorses at Bali’s spectacular muck diving sites"
            }
        ]),
        image_background: JSON.stringify([
          {
              id: '21423534523982',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '63284764283',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '0495684586745968',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '2346287346234723',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '892734827345234',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '283468273462834',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          }
        ]),
        image_showing: JSON.stringify([
          {
              id: '21423534523982',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '63284764283',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '0495684586745968',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '2346287346234723',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '892734827345234',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '283468273462834',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          }
        ]),
        image_galery: JSON.stringify([
          {
              id: '21423534523982',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '63284764283',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '0495684586745968',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '2346287346234723',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '892734827345234',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          },
          {
              id: '283468273462834',
              baseUrl: 'https://cache.desktopnexus.com/',
              url : 'https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg',
              path : 'thumbseg/2318/2318166-bigthumbnail.jpg'
          }
        ]),
        about: `
          <p>Bali is one of the many islands in the world’s largest archipelago, Indonesia. Though it may be one of the smaller islands in a nation that boasts diversity, Bali is quite the cultural wonder.</p>
          <p>Drawing in travelers like no other, Bali prides itself on its unequalled spirituality, sacred mountains and temples, verdant rice fields, iconic beaches, lively nightlife, and tasteful resorts and culinary options. Best part of it all? Travelers and divers of all kinds have the same chance of enjoying this one of a kind island. From five star resorts to backpacker hotels, gentle drifts to strong, challenging currents, Bali has them all.</p>
        `,
        more_about: JSON.stringify([
          {
              id: '345346546',
              type: 'text',
              key: 'Country',
              value : 'Indonesia'
          },
          {
              id: '982343290',
              type: 'text',
              key: 'When to Visit',
              value : 'April to October – The best weather is from May to September'
          },
          {
              id: '8273468234',
              type: 'link',
              key: 'Country',
              value : 'https://en.wikipedia.org/wiki/Bali'
          },
        ]),
        more_info: JSON.stringify([
          {
              id: '84579348',
              title: 'How to Get There',
              text: `
              <div class="col-lg-6 col-md-12">
                  <p>Flights to Ngurah Rai International Airport, Bali’s main airport, are plenty. Travelers can find flights from the rest of Indonesia, SouthEast Asia, Australia, Hong Kong, and Japan, as well as from Europe and the US through connecting flights, making the airport the second busiest in the country after the capital’s airport (Soekarno-Hatta International Airport, Jakarta, Indonesia).</p>
                  <p>Ngurah Rai International Airport is 30 minutes away from Denpasar, and a one hour drive from Kuta. Once arrived, travelers can easily find taxis with fixed or metered rates, or get on public buses (have a limited route)  and make use of hotel shuttles when available, if travelling on a budget.</p>
                  <p>Bali can also be reached by ferry rides from Java. The ride lasts about half an hour from Ketapang (Java) to Gilimanuk (Bali). </p>
              </div>
              `,
          },
          {
              id: '8237492834',
              title: 'Weather in Bali',
              text: `
              <div class="col-lg-6 col-md-12">
                  <p>As part of the tropics, Bali only has two seasons, the dry season and the rainy season. The dry season lasts from April to October and is the best season for diving, given the rainy season, which lasts from December to March, reduces visibility.</p>
                  <p>For a real chance to encounter the Mola Mola, May to OctoberSeptember is the optimal time when the wind picks up and colder water moves up to the surface in some area sometime water temperature can drop until 16-20 degrees.. Outside of this period, water temperature is generally 24-28 degrees.</p>
                  <p>Day time temperatures stay around 30-32 degrees and the air, humid. The best weather in Bali can be enjoyed on summer nights when the air is cooler and less humid.</p>
              </div>
              `,
          },
        ]),
        article: `
          <div class="col-lg-9 col-md-12 text-center">
              <h6 class="text-muted">Diving in Bali</h6>
              <h5 class="mb-5 font-weight-normal">Bali is the part of the coral triangle of Indonesia. Bali’s dive sites are as diverse as its culture. Spread out in different locations, with a rich marine life that’ll leave you in awe.</h5>
              <img src="https://cache.desktopnexus.com/thumbseg/2318/2318166-bigthumbnail.jpg" class="d-block w-100 mb-5">
              <div class="d-block">
                  <div class="row text-left">
                      <div class="col-md-6">
                          <p>You’ll find highly accessible dive sites, suitable for all levels, at Tulamben and Amed where the famed Liberty Wreck is located and the Seraya Secrets in Amed, home to a diversity of critters and a must for muck diving enthusiasts, just a few kilometers away. For an even easier scenic dive, you can visit Menjangan Island, near the peaceful Pemuteran village, where a little of everything is available--coral reefs, mucks, macro, walls, and stunning statues.</p>
                          <p>A trip to Padang Bai, the port to Lombok and the Gilis, also opens the way to the best dive spots for advanced divers. Gili Mimpang, Biaha, and Gili Tepekong offers reefs, walls, exhilarating currents, and close up encounters with sharks and occasionally, the Mola Mola.</p>
                      </div>
                      <div class="col-md-6">
                          <p>More experienced divers can also go for the big fishes in Nusa Penida and Nusa Lembongan, where Manta Rays are regulars and the chance of seeing Mola Molas are bigger, what with the upwellings.</p>
                          <p>These wondrous diving destinations are now supported by reliable dive equipment stores, a certified recompression chamber, and various dive centers spread across Bali.</p>
                      </div>
                  </div>
                  
                  
              </div>
          </div>
        `,
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create first country"
        }),
        created_at: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('destinations', null, {});
  }
};
