// 1_ nos traemos los elementos del HTML a JS
const body = document.querySelector("body");
const favoriteList = document.querySelector("#favorite-list");
const inputSearch = document.querySelector("#inputsearch");
const pokedex = document.querySelector("#pokedex");

// 2_ creamos el array donde irán los pokemons que nos de la PokeApi
let pokes = [];

// 8_ creamos el array vacío donde se guardarán los pokemons favoritos
let arrayFavoritos = [];

// 3_ petición a la API
const getPokemons = async () => {
    const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=150"
    );
    const data = await response.json();
    //console.log(data);
    for (const eachElement of data.results) {
        const res = await fetch(eachElement.url);
        const eachPokemon = await res.json();
        pokes.push(eachPokemon);
    }
    //console.log(pokes);
    return pokes;
};

// 5_ creamos la función de .map para quedarnos SOLO con los datos que nos interesan
const mapPokemons = (pokemonsSinMapear) => {
    const pokemonsMapeados = pokemonsSinMapear.map((result) => ({
        name: result.name,
        image: result.sprites[ "front_default" ],
        type: result.types.map((type) => type.type.name).join(", "),
        id: result.id,
    }));
    //console.log(pokemonsMapeados);
    return pokemonsMapeados;
};

// 7_ creamos la función del 'input buscar' para filtrar los pokemons
const handlerInput = () => {
    //valores del input que nos da el usuario al teclear
    const inputUserValue = inputSearch.value.toLowerCase();
    //creo la variable en donde guardaré el nuevo array de los pokemons filtrados
    //solo guarda los que devuelven true cuando la condición se cumple
    const pokesFiltrados = pokes.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(inputUserValue)
    );
    //pokesFiltrados están filtrados pero no mapeados
    //console.log(pokesFiltrados);
    //los mapeamos para que se queden solo con 4 propiedades (name, image, type e id)
    const mappedpokesFiltrados = mapPokemons(pokesFiltrados);
    //llamamos a la función render pasándole los pokemons filrados para que los pinte
    renderPokemons(mappedpokesFiltrados);
};
inputSearch.addEventListener("input", handlerInput);

// 6 _creamos la F render para renderizar los pokemons en pantalla y crear las <li>
const renderPokemons = (pokemons) => {
    //hay que modificar/limpiar el HTML (la lista de pokemons que estaban renderizados)
    //para poder pintar los nuevos pokemons filtrados
    pokedex.innerHTML = "";

    for (const pokemon of pokemons) {
        //creamos el bucle para ir creando los elementos en el HTML
        const li = document.createElement("li");
        li.setAttribute("class", "card");
        pokedex.appendChild(li);

        const pokeName = document.createElement("p");
        pokeName.textContent = pokemon.name;
        pokeName.setAttribute("class", "card-title");
        li.appendChild(pokeName);

        const image = document.createElement("img");
        image.setAttribute("src", pokemon.image);
        image.setAttribute("alt", pokemon.name);
        image.setAttribute("class", "card-image");
        li.appendChild(image);

        const pokeType = document.createElement("p");
        pokeType.textContent = pokemon.type;
        li.appendChild(pokeType);

        const pokeId = document.createElement("p");
        pokeId.textContent = "POKEID: " + pokemon.id;
        pokeId.setAttribute("class", "card-subtitle");
        li.appendChild(pokeId);

        const favoriteBtn = document.createElement("input");
        favoriteBtn.setAttribute("type", "checkbox");
        favoriteBtn.setAttribute("id", pokemon.id);
        favoriteBtn.setAttribute("name", pokemon.name);
        li.appendChild(favoriteBtn);
        favoriteBtn.addEventListener("change", () => {
            handlerBtn(pokemon);
        });
    }
}

// 9_ creamos la F del boton de los favoritos
const handlerBtn = (pokemon) => {
    const favoriteId = pokemon.id;
    const findPosition = arrayFavoritos.findIndex((pokemon) =>{
        return pokemon.id === favoriteId;
    });
    //console.log(pokemon);

    if (findPosition === -1) {
        arrayFavoritos.push(pokemon);
    } else {
        //si el id ya se encuentra adentro del array, sácalo
        arrayFavoritos.splice(findPosition, 1);
    }
// 11_ mandamos el array de favs al local storage
    localStorage.setItem("pokemonsFavoritos", JSON.stringify(arrayFavoritos));
    renderFavoritos();
    //console.log(arrayFavoritos);
    return arrayFavoritos;
}

// 10_ creamos la F para renderizar los favoritos
const renderFavoritos = () => {
    favoriteList.innerHTML = "";

    for (const pokemon of arrayFavoritos) {
        const li = document.createElement("li");
        li.setAttribute("class", "card");
        favoriteList.appendChild(li);

        const pokeName = document.createElement("p");
        pokeName.textContent = pokemon.name;
        pokeName.setAttribute("class", "card-title");
        li.appendChild(pokeName);

        const image = document.createElement("img");
        image.setAttribute("src", pokemon.image);
        image.setAttribute("alt", pokemon.name);
        image.setAttribute("class", "card-image");
        li.appendChild(image);

        const pokeType = document.createElement("p");
        pokeType.textContent = pokemon.type;
        li.appendChild(pokeType);

        const pokeId = document.createElement("p");
        pokeId.textContent = "POKEID: " + pokemon.id;
        pokeId.setAttribute("class", "card-subtitle");
        li.appendChild(pokeId);
    }

}

// 4 _ función PRINCIPAL
const main = async () => {
// 12_ hacer que no se borren los favs al refrescar la página
const getLocal = JSON.parse(localStorage.getItem("pokemonsFavoritos"));

if (getLocal) {
    arrayFavoritos = getLocal;
    renderFavoritos();
}
    const pokemons = await getPokemons(); //llamada a la F que contiene los pokemons
    //console.log(pokemons);
    const mappedpokemons = mapPokemons(pokemons);
    //console.log(mappedpokemons);
    renderPokemons(mappedpokemons);
};
main();