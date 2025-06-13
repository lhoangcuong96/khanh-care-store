import prisma from '@/database'

export class CartService {
  static addProductToCart = async (productId: string, quantity: number, variantId?: string | null, userId?: string) => {
    if (!userId) {
      throw new Error('Không tìm thấy user')
    }
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        ...(variantId && {
          variants: {
            some: {
              id: variantId
            }
          }
        })
      },
      select: {
        id: true,
        stock: true,
        variants: {
          select: {
            id: true,
            stock: true
          }
        }
      }
    })
    if (!product) throw new Error('Không tìm thấy sản phẩm')

    const productStock =
      (variantId ? product.variants.find((variant) => variant.id === variantId)?.stock : product.stock) || 0
    if (productStock < quantity) {
      throw new Error('Sản phẩm đã hết hàng')
    }

    const account = await prisma.account.findUniqueOrThrow({
      where: {
        id: userId
      }
    })

    if (!account) throw new Error('Không tìm thấy account')

    let cartItems = account.cart?.items || []

    const existingCartItem = cartItems.find((item) => item.productId === productId)
    if (existingCartItem) {
      cartItems = cartItems.map((item) => {
        if (item.productId === productId && item.variantId === variantId) {
          return {
            ...item,
            quantity: item.quantity + quantity
          }
        }
        return item
      })
    } else {
      cartItems.push({
        productId,
        variantId: variantId || null,
        quantity
      })
    }

    const updatedAccount = await prisma.account.update({
      where: {
        id: userId
      },
      data: {
        cart: {
          items: cartItems,
          updatedAt: new Date()
        }
      }
    })
    const listProduct = await prisma.product.findMany({
      where: {
        id: {
          in: account.cart.items.map((item) => item.productId)
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        slug: true,
        image: {
          select: {
            thumbnail: true
          }
        }
      }
    })

    const cartData = {
      ...updatedAccount.cart,
      items: updatedAccount.cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        product: listProduct.find((product) => product.id === item.productId)
      }))
    }

    return cartData
  }

  static getCart = async (userId?: string) => {
    if (!userId) {
      throw new Error('Không tìm thấy user')
    }
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        id: userId
      },
      select: {
        cart: {
          select: {
            items: true,
            updatedAt: true
          }
        }
      }
    })
    const cartItems = account.cart.items
    const getListProductPromise = prisma.product.findMany({
      where: {
        id: {
          in: cartItems.map((item) => item.productId)
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        slug: true,
        image: {
          select: {
            thumbnail: true
          }
        }
      }
    })
    const getListVariantPromise = prisma.productVariant.findMany({
      where: {
        id: {
          in: cartItems.map((item) => item.variantId).filter((id): id is string => id !== null)
        }
      },
      select: {
        id: true,
        name: true,
        price: true
      }
    })
    const [listProduct, listVariant] = await Promise.all([getListProductPromise, getListVariantPromise])

    const mapProductWithVariant = listProduct.map((product) => {
      const cartItem = cartItems.find((item) => item.productId === product.id)
      return {
        ...product,
        variant: listVariant.find((variant) => variant.id === cartItem?.variantId)
      }
    })

    const cartData = {
      items: cartItems.map((item) => ({
        product: mapProductWithVariant.find((product) => product.id === item.productId),
        quantity: item.quantity
      })),
      updatedAt: account.cart.updatedAt
    }
    console.log('cartData:', cartData)
    return cartData
  }

  static updateCartItemQuantity = async (productId: string, quantity: number, userId?: string) => {
    if (!userId) {
      throw new Error('Không tìm thấy user')
    }
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        id: userId
      }
    })
    if (!account) throw new Error('Không tìm thấy user')

    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: productId
      }
    })
    if (!product) throw new Error('Không tìm thấy sản phẩm')
    if (product.stock < quantity) {
      throw new Error('Sản phẩm đã hết hàng')
    }

    let cartItems = account.cart?.items || []

    const existingCartItem = cartItems.find((item) => item.productId === productId)
    if (existingCartItem) {
      cartItems = cartItems.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity: quantity
          }
        }
        return item
      })
    }

    const updatedAccount = await prisma.account.update({
      where: {
        id: userId
      },
      data: {
        cart: {
          items: cartItems,
          updatedAt: new Date()
        }
      }
    })
    return updatedAccount.cart
  }

  static removeProductFromCart = async (productId: string, userId?: string) => {
    if (!userId) {
      throw new Error('Không tìm thấy user')
    }
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        id: userId
      }
    })
    if (!account) throw new Error('Không tìm thấy user')
    let cartItems = account.cart?.items || []
    cartItems = cartItems.filter((item) => item.productId !== productId)
    await prisma.account.update({
      where: {
        id: userId
      },
      data: {
        cart: {
          items: cartItems,
          updatedAt: new Date()
        }
      }
    })
  }

  static clearCart = async (userId?: string) => {
    if (!userId) {
      throw new Error('Không tìm thấy user')
    }
    try {
      const user = await prisma.account.update({
        where: {
          id: userId
        },
        data: {
          cart: {
            items: [],
            updatedAt: new Date()
          }
        }
      })
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw new Error('Failed to clear cart')
    }
  }
}
