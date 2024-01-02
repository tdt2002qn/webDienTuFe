import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined } from '@ant-design/icons'

const CustomizedContent = (props) => {
  const { data, colors, setKeySelected } = props
  return (
    <div style={{ display: 'flex', gwap: '40px', alignItems: 'center', flexDirection: 'column-reverse' }}>
      {Object.keys(data) && Object.keys(data)?.map((item) => {
        return (
          <div
            key={Math.random()}
            style={{
              width: 1248,
              background: `linear-gradient(${colors[item] && colors[item][0]}, ${colors[item] && colors[item][1]})`,
              height: 200,
              display: 'flex',
              gap: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '10px',
              cursor: 'pointer',
              margin: '10px',
            }}
            onClick={() => setKeySelected(item)}
          >
            <span style={{ color: '#fff', fontSize: 50, }}>
              {item === 'users' && <UserOutlined />}
              {item === 'products' && <AppstoreOutlined />}
              {item === 'orders' && <ShoppingCartOutlined />}
            </span>
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase', }}>{item}</span>
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' }}>{data[item]}</span>
          </div>
        )
      })}
    </div>
  );
};

export default CustomizedContent;