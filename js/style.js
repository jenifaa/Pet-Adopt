let petsData = []; 

const loadButton = () => {
fetch("https://openapi.programming-hero.com/api/peddy/categories")
.then((res) => res.json())
.then((data) => {
    if (data && data.categories) 
    {
      displayButton(data.categories);
    } 
    else {
      console.error("Categories not found in the response");
    }
  })
.catch((error) => console.log(error));

};



const loadCards = async () => {
  
  const spinner = document.getElementById("spinner");
  spinner.classList.remove("hidden");
  setTimeout(async() => {
    try {
      const response = await fetch('https://openapi.programming-hero.com/api/peddy/pets'); 
      const data = await response.json();
      if (data) {
        petsData = data.pets; 
        displayCards(petsData);
      } else {
        console.error('Failed to fetch pets data');
      }
    } catch (error) {
      console.error('Error fetching pets data:', error);
    }

  },3000);
  
};




const sortPetsByPrice = () => {
  const sortedPets = petsData.slice().sort((a, b) => {
    return b.price - a.price;
  });
  displayCards(sortedPets); 
};
document.getElementById("sorting").addEventListener("click", sortPetsByPrice);



const displayCards = (data) => {

  const spinner = document.getElementById("spinner");
  spinner.classList.add("hidden");
const petContainer = document.getElementById("pets");
petContainer.innerHTML = " ";

if(data.length === 0){
  petContainer.classList.remove("grid");
  petContainer.innerHTML = `
  <div class="flex flex-col gap-5 justify-center items-center">
     <img class="mx-auto" src="images/error.webp" />
    <h2 class="text-2xl font-bold">No Information Available</h2>
    <p class="text-sm text-gray-500 mb-6">
    "We are excited to announce a new chapter in our journey to help animals find loving homes.</br> Soon, we will be expanding our services to include bird adoption, offering a unique opportunity </br> for our community to welcome these wonderful companions into their lives.
    </p>
  </div>
  `;
  return;
}

  data.forEach((pet) => {
    petContainer.classList.add("grid");
   // console.log(pet);
    const card = document.createElement("div");
    card.innerHTML = `
    
    
    <div class="card  md:w-70 border">
      <figure class="px-5 pt-5">
        <img
          src="${pet.image}"
          alt="${pet.name}"
          class="rounded-xl" />
      </figure>
      <div class="card-body items-start">
        <h2 class="font-bold text-xl">${pet.pet_name}</h2>
        <div class="flex justify-start items-center">
          <img class="w-[14px] h-[14px] mr-1" src="images/menu.png" />
          <p class="text-sm text-gray-600">Breed: ${pet.breed ? pet.breed : "Undefined"}</p>
        </div>  
        <p class="text-sm text-gray-600"><i class="fa-regular fa-calendar mr-1"></i> Birth: ${pet.date_of_birth ? pet.date_of_birth : "Undefined"}</p>
        <p class="text-sm text-gray-600"><i class="fa-solid fa-mercury mr-1"></i>  Gender: ${pet.gender ? pet.gender : "Undefined"}</p>
        <p class="text-sm text-gray-600 mb-2"><i class="fa-solid fa-dollar-sign mr-1"></i> Price : ${pet.price ? pet.price : "Undefined"}</p>
        <div class="border-b border-gray-300 w-full"></div>
        
      </div>
    
      <div class="flex justify-around items-center pb-2">
      <button  onclick="adoptPet('${pet.image}')" class="border px-4 py-2 rounded-xl"><i class="fa-regular fa-thumbs-up text-gray-500"></i></button>
      <button  class="text-button-colore border px-4 py-2 rounded-xl font-bold showing-modal">Adopt</button>
      <button onclick="loadDetails('${pet.petId}')" class="showing-modals text-button-colore border px-4 py-2 rounded-xl font-bold">Details</i></button>
      </div>
    
    </div>
    
    `;



    const adoptButton = card.querySelector(".showing-modal");
    adoptButton.addEventListener("click", () => {
      openModal(adoptButton, 3); 
    });
    petContainer.append(card);
    });



};




const displayButton = (categories) => {
  const CategoriesContainer = document.getElementById("categories");
  
  
  categories.forEach(item => {

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("rounded-xl","border","category-btn");
      buttonContainer.id = `btn-${item.category}`;
      buttonContainer.innerHTML = `
      <button onclick="loadCategoryCards('${item.category}')"  class=" flex flex-row justify-center items-center w-full h-full  py-4 px-8 md:py-7 md:px-20 text-2xl font-bold">
        <img class="w-[40px] h-[40px] mr-4" src="${item.category_icon}" />
        <div> ${item.category}</div>
      </button>
    `;
      
      CategoriesContainer.append(buttonContainer);
    
      
  });
};



const loadCategoryCards = (category) => {
  const spinner = document.getElementById("spinner");
  spinner.classList.remove("hidden");
  const petContainer = document.getElementById("pets");
  petContainer.innerHTML = " ";
  
 setTimeout(() => {
  fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
  .then((res) => res.json())
  .then((data) => {
      console.log(data.data);
      removeActiveClass();
      const activeBtn = document.getElementById(`btn-${category}`);
      activeBtn.classList.add("active");
      activeBtn.classList.remove("rounded-xl");
      displayCards(data.data); 
  })
  .catch((error) => console.log(error));
  
 }, 2000);
};

const removeActiveClass = () => {
  const button = document.getElementsByClassName("category-btn");
  for(let btn of button){
    btn.classList.remove("active");
  };
  
};




async function adoptPet(imageUrl) {
  const petContainer = document.getElementById("pets");
  let adoptedSection = document.getElementById("adoptedSection");
if(!adoptedSection)
{
  adoptedSection = document.createElement("div");
  adoptedSection.id = 'adoptedSection';
  adoptedSection.classList.add("hidden","border","rounded-xl", "border-gray-300" ,"p-4","w-40","md:w-80","ml-4");
  adoptedSection.innerHTML = `
   <div id="adoptedPets"></div>
  `;
  petContainer.parentNode.appendChild(adoptedSection);
}

adoptedSection.classList.remove('hidden');
adoptedSection.classList.add("block"); 
const adoptedPets = document.getElementById('adoptedPets');
adoptedPets.classList.add("grid","grid-cols-1", "md:grid-cols-2","gap-2");
  adoptedPets.innerHTML += `
    <img src="${imageUrl}" alt="Adopted Pet" class="rounded-xl mb-4" />
  `;
};


let countdownInterval;
const openModal = (button,counterValue) => {
  const modal = document.getElementById('my_modal_5');
  const counterDisplay = document.getElementById('counter-display');
  counterDisplay.textContent = counterValue;
  modal.showModal();

  clearInterval(countdownInterval);


  countdownInterval = setInterval(() => {
    counterValue--; 
    counterDisplay.textContent = counterValue;

   
    if (counterValue <= 0) {
      clearInterval(countdownInterval); 
      modal.close(); 

      button.disabled = true; 
      button.textContent = 'Adopted'; 
      button.classList.add("style-button");
    }
  }, 1000); 
};


const loadDetails = async (petId) => {
  const uri = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`;
const res = await fetch(uri);
const data = await res.json();
console.log(data);

displayDetails(data.petData);

};


const displayDetails = (petData) => {
  // Assuming you have a container to display the pet details
  const detailsContainer = document.getElementById("modal-content");

  detailsContainer.innerHTML = `
   <div class="rounded-xl p-4 flex justify-center items-center mb-3"><img class="rounded-xl" src="${petData.image}" /></div>
   <div class="text-xl font-bold mb-3">${petData.pet_name}</div>
   <div class="grid grid-cols-2">
   
     <div class="flex justify-start items-center mb-2">
          <img class="w-[14px] h-[14px] mr-1 " src="images/menu.png" />
          <p class="text-sm text-gray-600">Breed: ${petData.breed ? petData.breed : "Undefined"}</p>
        </div>  
        <p class="text-sm text-gray-600 mb-2"><i class="fa-regular fa-calendar mr-1"></i> Birth: ${petData.date_of_birth ? petData.date_of_birth : "Undefined"}</p>
        <p class="text-sm text-gray-600 mb-2"><i class="fa-solid fa-mercury mr-1"></i>  Gender: ${petData.gender ? petData.gender : "Undefined"}</p>
        <p class="text-sm text-gray-600 mb-2 "><i class="fa-solid fa-dollar-sign mr-1"></i> Price : ${petData.price ? petData.price : "Undefined"}</p>
         <p class="text-sm text-gray-600 mb-3"><i class="fa-solid fa-mercury mr-1"></i>  vaccinated status: ${petData.vaccinated_status ? petData.vaccinated_status: "Undefined"}</p>
   </div>
        <div class="border-b border-gray-300 w-full mb-4"></div>

        <p class="text-xl font-bold mb-4">Details Information</p>

        <p class="text-xs text-gray-600 mb-2 ">${petData.pet_details ? petData.pet_details: "Undefined"}</p>
   
  `;
  

  const modal = document.getElementById("my_modal_1");
  modal.showModal();

  
};




loadButton();
loadCards();
