import { writable } from 'svelte/store';
const textures = ["/origami/1.jpeg", "/origami/2.jpeg", "/origami/3.jpeg","/origami/4.png"];

interface Store {
    index: number;
    texture: string;

}




function createStore() {
    const { subscribe, update } = writable<Store>({
        index: 0,
        texture: textures[0],
    });

    return {
        subscribe,
        setIndex: (num: number) => update(() => ({
            index: num,
            texture: textures[num]
        }))
    };
}

export const useStore = createStore();

