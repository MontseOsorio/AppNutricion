import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

const API_URL = 'https://troyafit-api.onrender.com';

export default function Compras() {

  const [productos, setProductos] = useState<any[]>([]);
  useEffect(() => {
  const cargarProductos = async () => {
    try {
      const usuarioGuardado = await AsyncStorage.getItem('usuario');

      if (!usuarioGuardado) {
        console.log('No se encontró el usuario');
        return;
      }

      const usuario = JSON.parse(usuarioGuardado);

      const respuesta = await fetch(
        `${API_URL}/api/compras/generar/${usuario.id_usuario}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        console.log('Error al cargar compras:', datos);
        return;
      }

      const lista = datos.productos.map((producto: any) => ({
        id: producto.id_detalle_lista,
        nombre: producto.producto,
        cantidad: `${producto.cantidad} ${producto.unidad}`,
        categoria: (producto.categoria || 'otros')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase(),
        comprado: producto.comprado,
      }));

      setProductos(lista);

    } catch (error) {
      console.log('Error al conectar con compras:', error);
    }
  };

  cargarProductos();
}, []);
  // Proteínas empieza abierta
  const [categoriasAbiertas, setCategoriasAbiertas] = useState({
    proteinas: true,
    frutas: false,
    verduras: false,
    cereales: false,
    lacteos: false,
  });

  const marcarProducto = async (id: number) => {
  const productoActual = productos.find((p) => p.id === id);

  if (!productoActual) return;

  const nuevoEstado = !productoActual.comprado;

  try {
    const respuesta = await fetch(
      `${API_URL}/api/compras/producto/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comprado: nuevoEstado,
        }),
      }
    );

    if (!respuesta.ok) {
      throw new Error('No se pudo actualizar el producto');
    }

    setProductos((productosAnteriores) =>
      productosAnteriores.map((producto) =>
        producto.id === id
          ? { ...producto, comprado: nuevoEstado }
          : producto
      )
    );
  } catch (error) {
    console.error('Error al marcar producto:', error);
    alert('No se pudo guardar el cambio. Intenta nuevamente.');
  }
};

  const cambiarCategoria = (categoria: string) => {
    setCategoriasAbiertas({
      ...categoriasAbiertas,
      [categoria]: !categoriasAbiertas[categoria as keyof typeof categoriasAbiertas],
    });
  };

  const comprados = productos.filter(
    (producto) => producto.comprado
  ).length;

  const progreso = (comprados / productos.length) * 100;

  const mostrarProducto = (producto: any) => (
    <TouchableOpacity
      key={producto.id}
      style={styles.producto}
      onPress={() => marcarProducto(producto.id)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          producto.comprado && styles.checkboxComprado,
        ]}
      >
        {producto.comprado && (
          <Text style={styles.check}>
            ✓
          </Text>
        )}
      </View>

      <View style={styles.informacionProducto}>
        <Text
          style={[
            styles.nombreProducto,
            producto.comprado && styles.productoTachado,
          ]}
        >
          {producto.nombre}
        </Text>

        <Text style={styles.cantidad}>
          {producto.cantidad}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const mostrarCategoria = (
    titulo: string,
    categoria: string
  ) => {

    const abierta =
      categoriasAbiertas[
        categoria as keyof typeof categoriasAbiertas
      ];

    const productosCategoria = productos.filter(
      (producto) => producto.categoria === categoria
    );

    return (
      <View style={styles.categoria}>

        {/* Título de la categoría */}
        <TouchableOpacity
          style={styles.encabezadoCategoria}
          onPress={() => cambiarCategoria(categoria)}
          activeOpacity={0.7}
        >
          <Text style={styles.tituloCategoria}>
            {titulo}
          </Text>

          <Text style={styles.flecha}>
            {abierta ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {/* Productos */}
        {abierta && (
          <View>
            {productosCategoria.map(mostrarProducto)}
          </View>
        )}

      </View>
    );
  };

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* Título */}
        <Text style={styles.titulo}>
          Lista de compras
        </Text>

        <Text style={styles.subtitulo}>
          Todo listo para tu semana
        </Text>

        {/* Troyano */}
        <Image
          source={require('../../assets/images/troyanoCompras.png')}
          style={styles.troyano}
          resizeMode="contain"
        />

        {/* Progreso */}
        <View style={styles.tarjetaProgreso}>

          <View style={styles.filaProgreso}>

            <View>
              <Text style={styles.tituloProgreso}>
                Tu progreso
              </Text>

              <Text style={styles.textoProgreso}>
                {comprados} de {productos.length} productos
              </Text>
            </View>

            <Text style={styles.porcentaje}>
              {Math.round(progreso)}%
            </Text>

          </View>

          <View style={styles.barra}>
            <View
              style={[
                styles.progreso,
                { width: `${progreso}%` },
              ]}
            />
          </View>

        </View>
              
<TouchableOpacity
  style={styles.botonMenu}
  onPress={() => router.push('/perfil')}
>
   <Text style={styles.textoBotonMenu}>
    🥗 Ver mi menú
  </Text>
</TouchableOpacity>

        {/* Categorías */}

        {mostrarCategoria(
          '🥩  Proteínas',
          'proteinas'
        )}

        {mostrarCategoria(
          '🍎  Frutas',
          'frutas'
        )}

        {mostrarCategoria(
          '🥦  Verduras',
          'verduras'
        )}

        {mostrarCategoria(
          '🌾  Cereales',
          'cereales'
        )}

        {mostrarCategoria(
          '🥛  Lácteos',
          'lacteos'
        )}

        {/* Lista completada */}
        {comprados === productos.length && (
          <View style={styles.mensajeCompleto}>

            <Text style={styles.mensajeTexto}>
              🎉 ¡Lista completada!
            </Text>

            <Text style={styles.mensajeSubtexto}>
              Ya tienes todo listo para tu semana.
            </Text>

          </View>
        )}

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f1e8cf',
  },

  scroll: {
    paddingHorizontal: 22,
    paddingTop: 45,
    paddingBottom: 30,
  },

  titulo: {
    fontSize: 29,
    fontWeight: '800',
    color: '#1F416A',
    textAlign: 'center',
    marginBottom: 5,
  },

  subtitulo: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 0,
  },

  troyano: {
    width: 500,
    height: 200,
    alignSelf: 'center',
    marginVertical: -5,
  },

  tarjetaProgreso: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 17,
    marginBottom: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 8,

    elevation: 4,
  },

  filaProgreso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  tituloProgreso: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333333',
  },

  textoProgreso: {
    fontSize: 11,
    color: '#888888',
    marginTop: 3,
  },

  porcentaje: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4089C0',
  },

  barra: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progreso: {
    height: '100%',
    backgroundColor: '#4089C0',
    borderRadius: 10,
  },

  categoria: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    marginBottom: 13,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,

    overflow: 'hidden',
  },

  encabezadoCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  tituloCategoria: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F416A',
  },

  flecha: {
    fontSize: 12,
    color: '#4089C0',
    fontWeight: '800',
  },

  producto: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  checkboxComprado: {
    backgroundColor: '#4089C0',
    borderColor: '#4089C0',
  },

  check: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  informacionProducto: {
    flex: 1,
  },

  nombreProducto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
  },

  productoTachado: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },

  cantidad: {
    fontSize: 10,
    color: '#999999',
    marginTop: 2,
  },

  mensajeCompleto: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    marginTop: 2,
  },

  mensajeTexto: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4089C0',
  },

  mensajeSubtexto: {
    fontSize: 11,
    color: '#777777',
    marginTop: 4,
  },
  botonMenu: {
  backgroundColor: '#4089C0',
  borderRadius: 23,
  paddingVertical: 14,
  marginBottom: 15,
  alignItems: 'center',

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.12,
  shadowRadius: 6,

  elevation: 3,
},

textoBotonMenu: {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: '800',
},

});