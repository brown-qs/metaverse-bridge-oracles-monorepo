import { TextureType } from "src/texture/texturetype.enum";

export type PlayerTextureMapDto = {
    [key: string]: {
        textureData: string
        textureSignature: string
        type: TextureType
    }
}